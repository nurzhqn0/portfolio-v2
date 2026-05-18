from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ContactLink:
    id: int
    label: str
    type: str
    value: str
    url: str | None
    sort_order: int
    is_visible: bool

