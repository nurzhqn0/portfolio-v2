from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.db.models import AdminUserModel


class SqlAlchemyAdminUserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_email(self, email: str) -> AdminUserModel | None:
        result = await self.session.execute(
            select(AdminUserModel).where(AdminUserModel.email == email.lower())
        )
        return result.scalar_one_or_none()

    async def create(self, email: str, password_hash: str) -> AdminUserModel:
        user = AdminUserModel(email=email.lower(), password_hash=password_hash)
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

