from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.application.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.core.exceptions import not_found
from app.infrastructure.db.models import AdminUserModel
from app.infrastructure.repositories.sqlalchemy_project_repository import SqlAlchemyProjectRepository
from app.presentation.api.v1.dependencies import get_current_admin, get_project_repository

router = APIRouter(dependencies=[Depends(get_current_admin)])


@router.get("", response_model=list[ProjectRead])
async def list_admin_projects(
    projects: SqlAlchemyProjectRepository = Depends(get_project_repository),
) -> list[ProjectRead]:
    return await projects.list(include_unpublished=True)


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ProjectCreate,
    projects: SqlAlchemyProjectRepository = Depends(get_project_repository),
    _: AdminUserModel = Depends(get_current_admin),
) -> ProjectRead:
    return await projects.create(payload)


@router.put("/{project_id}", response_model=ProjectRead)
async def update_project(
    project_id: int,
    payload: ProjectUpdate,
    projects: SqlAlchemyProjectRepository = Depends(get_project_repository),
) -> ProjectRead:
    project = await projects.get(project_id)
    if project is None:
        raise not_found("Project not found")
    return await projects.update(project, payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    projects: SqlAlchemyProjectRepository = Depends(get_project_repository),
) -> None:
    project = await projects.get(project_id)
    if project is None:
        raise not_found("Project not found")
    await projects.delete(project)

