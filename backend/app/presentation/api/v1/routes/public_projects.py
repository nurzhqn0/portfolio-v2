from __future__ import annotations

from fastapi import APIRouter, Depends

from app.application.schemas.project import ProjectRead
from app.core.exceptions import not_found
from app.infrastructure.repositories.sqlalchemy_project_repository import SqlAlchemyProjectRepository
from app.presentation.api.v1.dependencies import get_project_repository

router = APIRouter()


@router.get("", response_model=list[ProjectRead])
async def list_projects(
    projects: SqlAlchemyProjectRepository = Depends(get_project_repository),
) -> list[ProjectRead]:
    return await projects.list(include_unpublished=False)


@router.get("/{slug}", response_model=ProjectRead)
async def get_project(
    slug: str,
    projects: SqlAlchemyProjectRepository = Depends(get_project_repository),
) -> ProjectRead:
    project = await projects.get_by_slug(slug)
    if project is None or not project.is_published:
        raise not_found("Project not found")
    return project

