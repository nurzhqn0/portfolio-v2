# Portfolio V2

Personal portfolio website with a FastAPI backend, React frontend, SQLite persistence, JWT-protected admin, Docker Compose deployment, and local media uploads.

## Stack

- Backend: FastAPI, SQLAlchemy 2, Alembic, SQLite, Pydantic, JWT auth
- Frontend: React, Vite, TypeScript, TailwindCSS, shadcn-style UI primitives
- Deploy: Docker Compose with separate backend and frontend containers

## Local Development

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Docker:

```bash
cp .env.example .env
docker compose up --build
```

Default admin credentials are controlled by `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

