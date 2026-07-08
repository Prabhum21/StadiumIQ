from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_security_headers():
    response = client.get("/")
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert response.headers.get("X-XSS-Protection") == "1; mode=block"
    assert (
        response.headers.get("Strict-Transport-Security") == "max-age=31536000; includeSubDomains"
    )


def test_payload_too_large():
    # Simulate a large payload
    headers = {"content-length": str(1024 * 1024 + 1)}
    response = client.post("/api/chat", json={}, headers=headers)
    assert response.status_code == 413
    assert response.json() == {"detail": "Payload too large"}


def test_request_id_header():
    response = client.get("/")
    assert response.status_code == 200
    assert "X-Request-ID" in response.headers
