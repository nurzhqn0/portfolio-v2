from __future__ import annotations

from fastapi import APIRouter, Depends

from app.application.schemas.auth import AdminUserRead
from app.infrastructure.db.models import AdminUserModel
from app.presentation.api.v1.dependencies import get_current_admin

router = APIRouter()


@router.get("/me", response_model=AdminUserRead)
async def me(current_admin: AdminUserModel = Depends(get_current_admin)) -> AdminUserModel:
    return current_admin

