from __future__ import annotations

from typing import Protocol

from app.application.schemas.profile import ProfileUpdate
from app.infrastructure.db.models import ProfileModel


class ProfileRepository(Protocol):
    async def get(self) -> ProfileModel | None: ...
    async def upsert(self, payload: ProfileUpdate) -> ProfileModel: ...

