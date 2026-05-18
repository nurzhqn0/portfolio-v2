from __future__ import annotations

from fastapi import APIRouter, Depends

from app.application.schemas.profile import ProfileRead, ProfileUpdate
from app.core.exceptions import not_found
from app.infrastructure.repositories.sqlalchemy_profile_repository import SqlAlchemyProfileRepository
from app.presentation.api.v1.dependencies import get_current_admin, get_profile_repository

router = APIRouter(dependencies=[Depends(get_current_admin)])


@router.get("", response_model=ProfileRead)
async def get_admin_profile(
    profiles: SqlAlchemyProfileRepository = Depends(get_profile_repository),
) -> ProfileRead:
    profile = await profiles.get()
    if profile is None:
        raise not_found("Profile has not been created yet")
    return profile


@router.put("", response_model=ProfileRead)
async def upsert_profile(
    payload: ProfileUpdate,
    profiles: SqlAlchemyProfileRepository = Depends(get_profile_repository),
) -> ProfileRead:
    return await profiles.upsert(payload)

