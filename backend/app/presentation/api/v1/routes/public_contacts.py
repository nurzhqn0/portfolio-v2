from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.application.schemas.contact import (
    ContactLinkRead,
    ContactMessageCreate,
    ContactMessageRead,
)
from app.infrastructure.repositories.sqlalchemy_contact_repository import SqlAlchemyContactRepository
from app.presentation.api.v1.dependencies import get_contact_repository

router = APIRouter()


@router.get("/contact-links", response_model=list[ContactLinkRead])
async def list_contact_links(
    contacts: SqlAlchemyContactRepository = Depends(get_contact_repository),
) -> list[ContactLinkRead]:
    return await contacts.list_links(include_hidden=False)


@router.post(
    "/contact-messages",
    response_model=ContactMessageRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_contact_message(
    payload: ContactMessageCreate,
    contacts: SqlAlchemyContactRepository = Depends(get_contact_repository),
) -> ContactMessageRead:
    return await contacts.create_message(payload)

