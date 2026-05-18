from fastapi.testclient import TestClient

from app.main import app


def test_seeded_profile_and_projects_are_public() -> None:
    with TestClient(app) as client:
        profile_response = client.get("/api/v1/profile")
        projects_response = client.get("/api/v1/projects")

    assert profile_response.status_code == 200
    assert profile_response.json()["headline"]
    assert projects_response.status_code == 200
    assert len(projects_response.json()) >= 1

