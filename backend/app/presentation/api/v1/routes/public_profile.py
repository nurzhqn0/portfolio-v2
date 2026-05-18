from __future__ import annotations

from fastapi import APIRouter, Depends

from app.application.schemas.profile import ProfileRead
from app.core.exceptions import not_found
from app.infrastructure.repositories.sqlalchemy_profile_repository import SqlAlchemyProfileRepository
from app.presentation.api.v1.dependencies import get_profile_repository

router = APIRouter()


@router.get("", response_model=ProfileRead)
async def get_profile(
    profiles: SqlAlchemyProfileRepository = Depends(get_profile_repository),
) -> ProfileRead:
    profile = await profiles.get()
    if profile is None:
        raise not_found("Profile has not been created yet")
    return profile

