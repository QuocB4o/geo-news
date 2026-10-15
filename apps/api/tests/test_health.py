from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_live():
    r = client.get("/api/v1/health/live")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}
    assert "x-correlation-id" in r.headers


def test_version():
    assert "version" in client.get("/api/v1/version").json()


def test_error_envelope():
    r = client.get("/api/v1/nope")
    body = r.json()
    assert r.status_code == 404
    assert {"code", "message", "correlationId"} <= body.keys()
