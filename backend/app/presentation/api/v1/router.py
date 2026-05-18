from __future__ import annotations

from fastapi import APIRouter

from app.presentation.api.v1.routes import (
    admin_contacts,
    admin_me,
    admin_profile,
    admin_projects,
    admin_uploads,
    auth,
    public_contacts,
    public_profile,
    public_projects,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin_me.router, prefix="/admin", tags=["admin"])
api_router.include_router(public_profile.router, prefix="/profile", tags=["public profile"])
api_router.include_router(public_projects.router, prefix="/projects", tags=["public projects"])
api_router.include_router(public_contacts.router, tags=["public contacts"])
api_router.include_router(admin_projects.router, prefix="/admin/projects", tags=["admin projects"])
api_router.include_router(admin_profile.router, prefix="/admin/profile", tags=["admin profile"])
api_router.include_router(admin_contacts.router, prefix="/admin", tags=["admin contacts"])
api_router.include_router(admin_uploads.router, prefix="/admin/uploads", tags=["admin uploads"])
