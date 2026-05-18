from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.schemas.project import ProjectCreate, ProjectUpdate
from app.application.use_cases.slug import slugify
from app.infrastructure.db.models import ProjectModel


class SqlAlchemyProjectRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list(self, include_unpublished: bool = False) -> list[ProjectModel]:
        statement = select(ProjectModel).order_by(ProjectModel.sort_order, ProjectModel.created_at.desc())
        if not include_unpublished:
            statement = statement.where(ProjectModel.is_published.is_(True))
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def get(self, project_id: int) -> ProjectModel | None:
        return await self.session.get(ProjectModel, project_id)

    async def get_by_slug(self, slug: str) -> ProjectModel | None:
        result = await self.session.execute(select(ProjectModel).where(ProjectModel.slug == slug))
        return result.scalar_one_or_none()

    async def create(self, payload: ProjectCreate) -> ProjectModel:
        data = payload.model_dump()
        data["slug"] = await self._unique_slug(data.get("slug") or data["title"])
        data = self._stringify_urls(data)
        project = ProjectModel(**data)
        self.session.add(project)
        await self.session.commit()
        await self.session.refresh(project)
        return project

    async def update(self, project: ProjectModel, payload: ProjectUpdate) -> ProjectModel:
        data = payload.model_dump(exclude_unset=True)
        if "slug" in data and data["slug"]:
            data["slug"] = await self._unique_slug(data["slug"], current_id=project.id)
        elif "title" in data and not project.slug:
            data["slug"] = await self._unique_slug(data["title"], current_id=project.id)
        data = self._stringify_urls(data)
        for key, value in data.items():
            setattr(project, key, value)
        await self.session.commit()
        await self.session.refresh(project)
        return project

    async def delete(self, project: ProjectModel) -> None:
        await self.session.delete(project)
        await self.session.commit()

    async def _unique_slug(self, value: str, current_id: int | None = None) -> str:
        base = slugify(value)
        candidate = base
        index = 2
        while True:
            existing = await self.get_by_slug(candidate)
            if existing is None or existing.id == current_id:
                return candidate
            candidate = f"{base}-{index}"
            index += 1

    @staticmethod
    def _stringify_urls(data: dict) -> dict:
        for key in ("live_url", "github_url"):
            if data.get(key) is not None:
                data[key] = str(data[key])
        return data

