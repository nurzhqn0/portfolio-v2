from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.schemas.contact import (
    ContactLinkCreate,
    ContactLinkUpdate,
    ContactMessageCreate,
)
from app.infrastructure.db.models import ContactLinkModel, ContactMessageModel


class SqlAlchemyContactRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_links(self, include_hidden: bool = False) -> list[ContactLinkModel]:
        statement = select(ContactLinkModel).order_by(ContactLinkModel.sort_order, ContactLinkModel.id)
        if not include_hidden:
            statement = statement.where(ContactLinkModel.is_visible.is_(True))
        result = await self.session.execute(statement)
        return list(result.scalars().all())

    async def get_link(self, link_id: int) -> ContactLinkModel | None:
        return await self.session.get(ContactLinkModel, link_id)

    async def create_link(self, payload: ContactLinkCreate) -> ContactLinkModel:
        data = payload.model_dump()
        data = self._stringify_urls(data)
        link = ContactLinkModel(**data)
        self.session.add(link)
        await self.session.commit()
        await self.session.refresh(link)
        return link

    async def update_link(
        self, link: ContactLinkModel, payload: ContactLinkUpdate
    ) -> ContactLinkModel:
        data = payload.model_dump(exclude_unset=True)
        data = self._stringify_urls(data)
        for key, value in data.items():
            setattr(link, key, value)
        await self.session.commit()
        await self.session.refresh(link)
        return link

    async def delete_link(self, link: ContactLinkModel) -> None:
        await self.session.delete(link)
        await self.session.commit()

    async def list_messages(self) -> list[ContactMessageModel]:
        result = await self.session.execute(
            select(ContactMessageModel).order_by(ContactMessageModel.created_at.desc())
        )
        return list(result.scalars().all())

    async def get_message(self, message_id: int) -> ContactMessageModel | None:
        return await self.session.get(ContactMessageModel, message_id)

    async def create_message(self, payload: ContactMessageCreate) -> ContactMessageModel:
        message = ContactMessageModel(**payload.model_dump())
        self.session.add(message)
        await self.session.commit()
        await self.session.refresh(message)
        return message

    async def mark_message(self, message: ContactMessageModel, is_read: bool) -> ContactMessageModel:
        message.is_read = is_read
        await self.session.commit()
        await self.session.refresh(message)
        return message

    @staticmethod
    def _stringify_urls(data: dict) -> dict:
        if data.get("url") is not None:
            data["url"] = str(data["url"])
        return data

