import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "StadiumIQ AI Backend is running"}

def test_chat_endpoint_invalid_payload():
    response = client.post("/api/chat", json={"invalid": "payload"})
    assert response.status_code == 422

@patch("api.routes.gemini_service.get_fan_assistant_response", new_callable=AsyncMock)
def test_chat_endpoint_valid(mock_chat):
    mock_chat.return_value = "Mocked chat response"
    response = client.post("/api/chat", json={"message": "Hello", "user_profile": {"ticket": "VIP"}})
    assert response.status_code == 200
    assert response.json() == {"response": "Mocked chat response"}
    mock_chat.assert_called_once_with(query="Hello", user_profile={"ticket": "VIP"})

def test_decision_endpoint_invalid_payload():
    response = client.post("/api/decision", json={"invalid": "payload"})
    assert response.status_code == 422

@patch("api.routes.gemini_service.get_decision_recommendation", new_callable=AsyncMock)
def test_decision_endpoint_valid(mock_decision):
    mock_decision.return_value = {"recommendation": "Mocked decision"}
    response = client.post("/api/decision", json={"context_data": {"mode": "security"}})
    assert response.status_code == 200
    assert response.json() == {"recommendation": {"recommendation": "Mocked decision"}}
    mock_decision.assert_called_once_with(context_data={"mode": "security"})

def test_get_crowd_metrics():
    response = client.get("/api/crowd")
    assert response.status_code == 200
    data = response.json()
    assert "zones" in data
    assert len(data["zones"]) == 4
    assert data["zones"][0]["name"] == "North Gate"

@patch("api.routes.gemini_service.get_fan_assistant_response", new_callable=AsyncMock)
def test_chat_endpoint_exception(mock_chat):
    mock_chat.side_effect = Exception("Internal Error")
    response = client.post("/api/chat", json={"message": "Hello", "user_profile": {}})
    assert response.status_code == 500
    assert response.json() == {"detail": "Internal Server Error"}

@patch("api.routes.gemini_service.get_decision_recommendation", new_callable=AsyncMock)
def test_decision_endpoint_exception(mock_decision):
    mock_decision.side_effect = Exception("Internal Error")
    response = client.post("/api/decision", json={"context_data": {"mode": "security"}})
    assert response.status_code == 500
    assert response.json() == {"detail": "Internal Server Error"}
