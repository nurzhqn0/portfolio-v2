from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ContactLinkBase(BaseModel):
    label: str = Field(min_length=1, max_length=120)
    type: str = Field(min_length=1, max_length=40)
    value: str = Field(min_length=1, max_length=255)
    url: str | None = Field(default=None, max_length=500)
    sort_order: int = 0
    is_visible: bool = True


class ContactLinkCreate(ContactLinkBase):
    pass


class ContactLinkUpdate(BaseModel):
    label: str | None = Field(default=None, min_length=1, max_length=120)
    type: str | None = Field(default=None, min_length=1, max_length=40)
    value: str | None = Field(default=None, min_length=1, max_length=255)
    url: str | None = Field(default=None, max_length=500)
    sort_order: int | None = None
    is_visible: bool | None = None


class ContactLinkRead(ContactLinkBase):
    id: int
    url: str | None = None

    model_config = {"from_attributes": True}


class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=4000)


class ContactMessageUpdate(BaseModel):
    is_read: bool


class ContactMessageRead(ContactMessageCreate):
    id: int
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
