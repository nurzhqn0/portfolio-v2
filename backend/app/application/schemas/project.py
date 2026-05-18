from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl


class ProjectBase(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    slug: str | None = Field(default=None, max_length=180)
    summary: str = Field(min_length=1, max_length=300)
    description: str = Field(min_length=1)
    cover_image_url: str | None = None
    gallery_image_urls: list[str] = Field(default_factory=list)
    tech_stack: list[str] = Field(default_factory=list)
    live_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    is_featured: bool = False
    sort_order: int = 0
    is_published: bool = True


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=160)
    slug: str | None = Field(default=None, max_length=180)
    summary: str | None = Field(default=None, min_length=1, max_length=300)
    description: str | None = Field(default=None, min_length=1)
    cover_image_url: str | None = None
    gallery_image_urls: list[str] | None = None
    tech_stack: list[str] | None = None
    live_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    is_featured: bool | None = None
    sort_order: int | None = None
    is_published: bool | None = None


class ProjectRead(ProjectBase):
    id: int
    slug: str
    live_url: str | None = None
    github_url: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

