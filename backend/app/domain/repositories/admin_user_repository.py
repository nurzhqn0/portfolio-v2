from __future__ import annotations

from typing import Protocol

from app.infrastructure.db.models import AdminUserModel


class AdminUserRepository(Protocol):
    async def get_by_email(self, email: str) -> AdminUserModel | None: ...

