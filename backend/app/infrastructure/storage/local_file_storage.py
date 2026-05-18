from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.core.config import settings

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "application/pdf",
}


class LocalFileStorage:
    def __init__(self, root: Path | None = None) -> None:
        self.root = root or settings.media_root
        self.root.mkdir(parents=True, exist_ok=True)

    async def save(self, upload: UploadFile) -> str:
        if upload.content_type not in ALLOWED_CONTENT_TYPES:
            raise ValueError("Unsupported file type")

        extension = Path(upload.filename or "").suffix.lower()
        filename = f"{uuid4().hex}{extension}"
        destination = self.root / filename

        content = await upload.read()
        destination.write_bytes(content)
        return f"/media/{filename}"

