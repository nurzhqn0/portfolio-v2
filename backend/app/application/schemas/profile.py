from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class ProfileUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    headline: str = Field(min_length=1, max_length=255)
    bio: str = Field(min_length=1)
    landing_photo_url: str | None = None
    resume_url: str | None = None
    location: str | None = Field(default=None, max_length=120)
    is_available: bool = True


class ProfileRead(ProfileUpdate):
    id: int
    updated_at: datetime

    model_config = {"from_attributes": True}

