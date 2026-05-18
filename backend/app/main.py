from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password
from app.infrastructure.db.models import AdminUserModel, ContactLinkModel, ProfileModel, ProjectModel
from app.infrastructure.db.session import async_session_factory, init_db
from app.presentation.api.v1.router import api_router


async def seed_initial_data() -> None:
    async with async_session_factory() as session:
        admin = await session.execute(
            select(AdminUserModel).where(AdminUserModel.email == settings.admin_email.lower())
        )
        if admin.scalar_one_or_none() is None:
            session.add(
                AdminUserModel(
                    email=settings.admin_email.lower(),
                    password_hash=hash_password(settings.admin_password),
                )
            )

        profile = await session.execute(select(ProfileModel))
        if profile.scalars().first() is None:
            session.add(
                ProfileModel(
                    name="Your Name",
                    headline="Creative developer building thoughtful digital products",
                    bio=(
                        "A portfolio for selected projects, experiments, and ways to get in touch. "
                        "Update this content from the admin dashboard."
                    ),
                    location="Almaty, Kazakhstan",
                    is_available=True,
                )
            )

        projects = await session.execute(select(ProjectModel))
        if projects.scalars().first() is None:
            session.add(
                ProjectModel(
                    title="Portfolio Platform",
                    slug="portfolio-platform",
                    summary="A clean personal portfolio with admin-managed projects and contacts.",
                    description=(
                        "This project combines a FastAPI backend, React frontend, SQLite persistence, "
                        "and a simple admin experience for managing portfolio content."
                    ),
                    tech_stack=["FastAPI", "React", "TailwindCSS", "SQLite"],
                    gallery_image_urls=[],
                    is_featured=True,
                    sort_order=1,
                    is_published=True,
                )
            )

        links = await session.execute(select(ContactLinkModel))
        if links.scalars().first() is None:
            session.add_all(
                [
                    ContactLinkModel(
                        label="Email",
                        type="email",
                        value="hello@example.com",
                        url="mailto:hello@example.com",
                        sort_order=1,
                    ),
                    ContactLinkModel(
                        label="LinkedIn",
                        type="linkedin",
                        value="linkedin.com/in/your-profile",
                        url="https://linkedin.com",
                        sort_order=2,
                    ),
                    ContactLinkModel(
                        label="GitHub",
                        type="github",
                        value="github.com/your-profile",
                        url="https://github.com",
                        sort_order=3,
                    ),
                ]
            )
        await session.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Path(settings.media_root).mkdir(parents=True, exist_ok=True)
    await init_db()
    await seed_initial_data()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/media", StaticFiles(directory=settings.media_root), name="media")
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}

