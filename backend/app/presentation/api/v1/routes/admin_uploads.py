from __future__ import annotations

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.application.schemas.upload import UploadResponse
from app.infrastructure.storage.local_file_storage import LocalFileStorage
from app.presentation.api.v1.dependencies import get_current_admin

router = APIRouter(dependencies=[Depends(get_current_admin)])


@router.post("", response_model=UploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_file(file: UploadFile = File(...)) -> UploadResponse:
    storage = LocalFileStorage()
    try:
        url = await storage.save(file)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return UploadResponse(url=url)

