from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.application.schemas.contact import (
    ContactLinkCreate,
    ContactLinkRead,
    ContactLinkUpdate,
    ContactMessageRead,
    ContactMessageUpdate,
)
from app.core.exceptions import not_found
from app.infrastructure.repositories.sqlalchemy_contact_repository import SqlAlchemyContactRepository
from app.presentation.api.v1.dependencies import get_contact_repository, get_current_admin

router = APIRouter(dependencies=[Depends(get_current_admin)])


@router.get("/contact-links", response_model=list[ContactLinkRead])
async def list_admin_contact_links(
    contacts: SqlAlchemyContactRepository = Depends(get_contact_repository),
) -> list[ContactLinkRead]:
    return await contacts.list_links(include_hidden=True)


@router.post("/contact-links", response_model=ContactLinkRead, status_code=status.HTTP_201_CREATED)
async def create_contact_link(
    payload: ContactLinkCreate,
    contacts: SqlAlchemyContactRepository = Depends(get_contact_repository),
) -> ContactLinkRead:
    return await contacts.create_link(payload)


@router.put("/contact-links/{link_id}", response_model=ContactLinkRead)
async def update_contact_link(
    link_id: int,
    payload: ContactLinkUpdate,
    contacts: SqlAlchemyContactRepository = Depends(get_contact_repository),
) -> ContactLinkRead:
    link = await contacts.get_link(link_id)
    if link is None:
        raise not_found("Contact link not found")
    return await contacts.update_link(link, payload)


@router.delete("/contact-links/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact_link(
    link_id: int,
    contacts: SqlAlchemyContactRepository = Depends(get_contact_repository),
) -> None:
    link = await contacts.get_link(link_id)
    if link is None:
        raise not_found("Contact link not found")
    await contacts.delete_link(link)


@router.get("/contact-messages", response_model=list[ContactMessageRead])
async def list_messages(
    contacts: SqlAlchemyContactRepository = Depends(get_contact_repository),
) -> list[ContactMessageRead]:
    return await contacts.list_messages()


@router.patch("/contact-messages/{message_id}", response_model=ContactMessageRead)
async def update_message(
    message_id: int,
    payload: ContactMessageUpdate,
    contacts: SqlAlchemyContactRepository = Depends(get_contact_repository),
) -> ContactMessageRead:
    message = await contacts.get_message(message_id)
    if message is None:
        raise not_found("Contact message not found")
    return await contacts.mark_message(message, payload.is_read)

