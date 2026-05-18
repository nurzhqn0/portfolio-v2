from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Profile:
    id: int
    name: str
    headline: str
    bio: str
    landing_photo_url: str | None
    resume_url: str | None
    location: str | None
    is_available: bool
    updated_at: datetime

