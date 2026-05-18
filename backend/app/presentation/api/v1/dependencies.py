from __future__ import annotations

from collections.abc import AsyncIterator

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import unauthorized
from app.core.security import decode_access_token
from app.infrastructure.db.models import AdminUserModel
from app.infrastructure.db.session import get_session
from app.infrastructure.repositories.sqlalchemy_admin_user_repository import (
    SqlAlchemyAdminUserRepository,
)
from app.infrastructure.repositories.sqlalchemy_contact_repository import SqlAlchemyContactRepository
from app.infrastructure.repositories.sqlalchemy_profile_repository import SqlAlchemyProfileRepository
from app.infrastructure.repositories.sqlalchemy_project_repository import SqlAlchemyProjectRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_db_session() -> AsyncIterator[AsyncSession]:
    async for session in get_session():
        yield session


def get_admin_user_repository(
    session: AsyncSession = Depends(get_db_session),
) -> SqlAlchemyAdminUserRepository:
    return SqlAlchemyAdminUserRepository(session)


def get_project_repository(
    session: AsyncSession = Depends(get_db_session),
) -> SqlAlchemyProjectRepository:
    return SqlAlchemyProjectRepository(session)


def get_profile_repository(
    session: AsyncSession = Depends(get_db_session),
) -> SqlAlchemyProfileRepository:
    return SqlAlchemyProfileRepository(session)


def get_contact_repository(
    session: AsyncSession = Depends(get_db_session),
) -> SqlAlchemyContactRepository:
    return SqlAlchemyContactRepository(session)


async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    users: SqlAlchemyAdminUserRepository = Depends(get_admin_user_repository),
) -> AdminUserModel:
    email = decode_access_token(token)
    if email is None:
        raise unauthorized()
    user = await users.get_by_email(email)
    if user is None or not user.is_active:
        raise unauthorized()
    return user

