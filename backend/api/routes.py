from fastapi import APIRouter, Depends, HTTPException, Request
import logging
from typing import Dict, Any, List
from pydantic import BaseModel
from services.gemini_service import GeminiService
from api.limiter import limiter
from schemas.api_models import ChatRequest, DecisionRequest

class SustainabilityRequest(BaseModel):
    travel_mode: str
    distance: float

class AnnouncementRequest(BaseModel):
    message: str
    languages: List[str]

class BriefingRequest(BaseModel):
    role: str
    location: str

logger = logging.getLogger("api.routes")
router = APIRouter()
gemini_service = GeminiService()

@router.post("/chat", response_model=Dict[str, Any])
@limiter.limit("20/minute")
async def chat_endpoint(request: Request, payload: ChatRequest) -> Dict[str, Any]:
    """
    Endpoint for the Fan Assistant chat interaction.
    """
    try:
        response = await gemini_service.get_fan_assistant_response(
            query=payload.message, 
            user_profile=payload.user_profile
        )
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat_endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/decision", response_model=Dict[str, Any])
@limiter.limit("10/minute")
async def decision_endpoint(request: Request, payload: DecisionRequest) -> Dict[str, Any]:
    """
    Endpoint for the StadiumIQ AI Decision Engine.
    """
    try:
        recommendation = await gemini_service.get_decision_recommendation(
            context_data=payload.context_data.model_dump()
        )
        return {"recommendation": recommendation}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in decision_endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/crowd", response_model=Dict[str, Any])
@limiter.limit("30/minute")
async def get_crowd_metrics(request: Request) -> Dict[str, Any]:
    """
    Endpoint to retrieve current crowd metrics for demonstration purposes.
    """
    return {
        "zones": [
            {"name": "North Gate", "density": "High", "queue_time": 15, "trend": "increasing"},
            {"name": "South Gate", "density": "Low", "queue_time": 2, "trend": "stable"},
            {"name": "Food Court A", "density": "Medium", "queue_time": 8, "trend": "decreasing"},
            {"name": "Medical Tent 1", "density": "Low", "queue_time": 0, "trend": "stable"}
        ]
    }

@router.post("/sustainability", response_model=Dict[str, Any])
@limiter.limit("10/minute")
async def sustainability_endpoint(request: Request, payload: SustainabilityRequest) -> Dict[str, Any]:
    try:
        data = await gemini_service.get_sustainability_footprint(payload.travel_mode, payload.distance)
        return data
    except Exception as e:
        logger.error(f"Error in sustainability_endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/announce", response_model=Dict[str, Any])
@limiter.limit("10/minute")
async def announce_endpoint(request: Request, payload: AnnouncementRequest) -> Dict[str, Any]:
    try:
        data = await gemini_service.generate_pa_announcement(payload.message, payload.languages)
        return data
    except Exception as e:
        logger.error(f"Error in announce_endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/briefing", response_model=Dict[str, Any])
@limiter.limit("10/minute")
async def briefing_endpoint(request: Request, payload: BriefingRequest) -> Dict[str, Any]:
    try:
        data = await gemini_service.generate_shift_briefing(payload.role, payload.location)
        return data
    except Exception as e:
        logger.error(f"Error in briefing_endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
