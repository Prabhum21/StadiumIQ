import pytest
import asyncio
from unittest.mock import patch, MagicMock
from services.gemini_service import GeminiService

@pytest.mark.asyncio
async def test_gemini_fallback():
    # Initialize service
    service = GeminiService()
    
    # Mock the client to raise an exception immediately
    with patch.object(service, 'get_client') as mock_client:
        mock_client.side_effect = Exception("Simulated API failure")
        
        # Call the decision recommendation
        response = await service.get_decision_recommendation(context_data={"mode": "test"})
        
        # Assert that the fallback JSON is returned (not a crash)
        assert isinstance(response, dict)
        assert response.get("risk_score") == 100
        assert "Escalate to manual review" in response.get("reasoning", "")
        
@pytest.mark.asyncio
async def test_gemini_chat_fallback():
    service = GeminiService()
    
    with patch.object(service, 'get_client') as mock_client:
        mock_client.side_effect = Exception("Simulated API failure")
        
        response = await service.get_fan_assistant_response(query="Help", user_profile={})
        
        # Assert fallback text
        assert "connection issues" in response
