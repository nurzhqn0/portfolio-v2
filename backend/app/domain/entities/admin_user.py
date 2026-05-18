from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class AdminUser:
    id: int
    email: str
    password_hash: str
    is_active: bool
    created_at: datetime

