from __future__ import annotations

from fastapi import APIRouter, Depends

from app.application.schemas.auth import LoginRequest, TokenResponse
from app.core.exceptions import unauthorized
from app.core.security import create_access_token, verify_password
from app.infrastructure.repositories.sqlalchemy_admin_user_repository import (
    SqlAlchemyAdminUserRepository,
)
from app.presentation.api.v1.dependencies import get_admin_user_repository

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    users: SqlAlchemyAdminUserRepository = Depends(get_admin_user_repository),
) -> TokenResponse:
    user = await users.get_by_email(payload.email)
    if user is None or not user.is_active:
        raise unauthorized("Invalid email or password")
    if not verify_password(payload.password, user.password_hash):
        raise unauthorized("Invalid email or password")
    return TokenResponse(access_token=create_access_token(user.email))


