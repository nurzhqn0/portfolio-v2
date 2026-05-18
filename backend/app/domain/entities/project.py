from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class Project:
    id: int
    title: str
    slug: str
    summary: str
    description: str
    cover_image_url: str | None
    gallery_image_urls: list[str]
    tech_stack: list[str]
    live_url: str | None
    github_url: str | None
    is_featured: bool
    sort_order: int
    is_published: bool
    created_at: datetime
    updated_at: datetime

