from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any
from services.gemini_service import GeminiService

router = APIRouter()
gemini_service = GeminiService()

from api.limiter import limiter

from pydantic import Field

class ChatRequest(BaseModel):
    message: str
    user_profile: Dict[str, Any] = Field(default_factory=dict)

class ContextData(BaseModel):
    mode: str = Field(default="navigation")
    model_config = {"extra": "allow"}

class DecisionRequest(BaseModel):
    context_data: ContextData

@router.post("/chat")
@limiter.limit("20/minute")
async def chat_endpoint(request: Request, payload: ChatRequest):
    try:
        response = await gemini_service.get_fan_assistant_response(
            query=payload.message, 
            user_profile=payload.user_profile
        )
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/decision")
@limiter.limit("10/minute")
async def decision_endpoint(request: Request, payload: DecisionRequest):
    try:
        recommendation = await gemini_service.get_decision_recommendation(
            context_data=payload.context_data.model_dump()
        )
        return {"recommendation": recommendation}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/crowd")
async def get_crowd_metrics():
    # Mock data for demonstration purposes
    return {
        "zones": [
            {"name": "North Gate", "density": "High", "queue_time": 15, "trend": "increasing"},
            {"name": "South Gate", "density": "Low", "queue_time": 2, "trend": "stable"},
            {"name": "Food Court A", "density": "Medium", "queue_time": 8, "trend": "decreasing"},
            {"name": "Medical Tent 1", "density": "Low", "queue_time": 0, "trend": "stable"}
        ]
    }
