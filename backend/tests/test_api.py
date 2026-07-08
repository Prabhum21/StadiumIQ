import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "StadiumIQ AI Backend is running"}

def test_chat_endpoint_invalid_payload():
    response = client.post("/api/chat", json={"invalid": "payload"})
    assert response.status_code == 422 # Pydantic validation error

def test_decision_endpoint_invalid_payload():
    response = client.post("/api/decision", json={"invalid": "payload"})
    assert response.status_code == 422
