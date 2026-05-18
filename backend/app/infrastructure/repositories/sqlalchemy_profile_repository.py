from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.schemas.profile import ProfileUpdate
from app.infrastructure.db.models import ProfileModel


class SqlAlchemyProfileRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get(self) -> ProfileModel | None:
        result = await self.session.execute(select(ProfileModel).order_by(ProfileModel.id.asc()))
        return result.scalars().first()

    async def upsert(self, payload: ProfileUpdate) -> ProfileModel:
        profile = await self.get()
        data = payload.model_dump()
        if profile is None:
            profile = ProfileModel(**data)
            self.session.add(profile)
        else:
            for key, value in data.items():
                setattr(profile, key, value)
        await self.session.commit()
        await self.session.refresh(profile)
        return profile

