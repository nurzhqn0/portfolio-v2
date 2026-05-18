from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class ContactMessage:
    id: int
    name: str
    email: str
    message: str
    is_read: bool
    created_at: datetime

