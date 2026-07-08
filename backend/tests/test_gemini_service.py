import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from services.gemini_service import GeminiService


@pytest.fixture
def gemini_service():
    with patch("services.gemini_service.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.aio.models.generate_content = AsyncMock()
        mock_client_cls.return_value = mock_client
        service = GeminiService()
        service.base_delay = 0  # Speed up tests
        yield service


@pytest.mark.asyncio
async def test_get_fan_assistant_response(gemini_service):
    mock_generate = gemini_service.get_client().aio.models.generate_content
    mock_response = MagicMock()
    mock_response.text = "Hello fan"
    mock_generate.return_value = mock_response

    response = await gemini_service.get_fan_assistant_response(
        "Where is bathroom?", {"persona": "fan"}
    )
    assert response == "Hello fan"
    mock_generate.assert_called_once()


@pytest.mark.asyncio
async def test_get_decision_recommendation(gemini_service):
    mock_generate = gemini_service.get_client().aio.models.generate_content
    mock_response = MagicMock()
    mock_response.text = json.dumps(
        {
            "overall_status": "OK",
            "risk_score": 10,
            "priority": "Low",
            "recommended_actions": [],
            "predicted_problems": [],
            "volunteer_deployment": [],
            "executive_summary": "All good",
            "risk_trajectory": [],
        }
    )
    mock_generate.return_value = mock_response

    response = await gemini_service.get_decision_recommendation({"mode": "operations"})
    assert response["overall_status"] == "OK"
    mock_generate.assert_called_once()


@pytest.mark.asyncio
async def test_generate_with_retry_failure_fallback(gemini_service):
    mock_generate = gemini_service.get_client().aio.models.generate_content
    mock_generate.side_effect = Exception("API down")

    with patch("services.gemini_service.asyncio.sleep", new_callable=AsyncMock):
        response = await gemini_service.get_decision_recommendation({"mode": "operations"})

        # It should retry 'max_retries' times. Default is 2, so 3 calls total.
        assert mock_generate.call_count == gemini_service.max_retries + 1
        assert response["overall_status"] == "Critical"  # Fallback hit


@pytest.mark.asyncio
async def test_caching_behavior(gemini_service):
    mock_generate = gemini_service.get_client().aio.models.generate_content
    mock_response = MagicMock()
    mock_response.text = "Cached Response"
    mock_generate.return_value = mock_response

    # First call hits API
    resp1 = await gemini_service.get_fan_assistant_response("Unique query", {})
    assert resp1 == "Cached Response"
    assert mock_generate.call_count == 1

    # Second identical call hits cache
    resp2 = await gemini_service.get_fan_assistant_response("Unique query", {})
    assert resp2 == "Cached Response"
    assert mock_generate.call_count == 1


def test_offline_engine_crowd_prediction(gemini_service):
    res = gemini_service.offline_engine.get_crowd_prediction("North Gate")
    assert res["name"] == "North Gate"
    assert res["predicted_surge"] is False
    assert "estimated_density" in res


def test_offline_engine_classify_incident(gemini_service):
    res = gemini_service.offline_engine.classify_incident("There is a fire in Section A")
    assert res["priority"] == "Critical"
    assert res["evacuation_required"] is True

    res2 = gemini_service.offline_engine.classify_incident("Minor lost child report")
    assert res2["priority"] == "Medium"
    assert res2["evacuation_required"] is False


def test_offline_engine_navigation_suggestions(gemini_service):
    res = gemini_service.offline_engine.get_navigation_suggestions("Gate A", "Gate B")
    assert "recommended_route" in res
    assert len(res["recommended_route"]) > 0


def test_offline_engine_emergency_response(gemini_service):
    res = gemini_service.offline_engine.get_emergency_response("Fire")
    assert res["priority"] == "Critical"
    assert res["evacuation_required"] is True


def test_offline_engine_estimate_risk(gemini_service):
    res = gemini_service.offline_engine.estimate_risk({"mode": "operations"})
    assert res["overall_status"] == "Critical"

    assert "risk_trajectory" in res
