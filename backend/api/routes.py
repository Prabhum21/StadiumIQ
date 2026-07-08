"""
FastAPI routing module. Maps endpoints to underlying AI services and mock data.
"""

import logging

from fastapi import APIRouter, Request

from api.limiter import limiter
from schemas.api_models import (
    AnnouncementRequest,
    BriefingRequest,
    BriefingResponse,
    CapabilitiesResponse,
    Capability,
    ChatRequest,
    ChatResponse,
    CrowdResponse,
    DecisionRequest,
    DecisionResponse,
    MultilingualAssistRequest,
    MultilingualAssistResponse,
    SustainabilityRequest,
    SustainabilityResponse,
)
from services.gemini_service import GeminiService

logger = logging.getLogger("api.routes")
router = APIRouter()
gemini_service = GeminiService()


@router.post("/chat", response_model=ChatResponse)
@limiter.limit("20/minute")
async def chat_endpoint(request: Request, payload: ChatRequest) -> ChatResponse:
    """
    Endpoint for the Fan Assistant chat interaction.

    Args:
        request: FastAPI request object (used for rate limiting).
        payload: ChatRequest containing the user's message and profile.

    Returns:
        ChatResponse containing the AI generated response.
    """
    response = await gemini_service.get_fan_assistant_response(
        query=payload.message, user_profile=payload.user_profile
    )
    return ChatResponse(response=response)


@router.post("/decision", response_model=DecisionResponse)
@limiter.limit("10/minute")
async def decision_endpoint(request: Request, payload: DecisionRequest) -> DecisionResponse:
    """
    Endpoint for the StadiumIQ AI Decision Engine.

    Args:
        request: FastAPI request object.
        payload: DecisionRequest with contextual telemetry.

    Returns:
        DecisionResponse with the operational strategy.
    """
    recommendation = await gemini_service.get_decision_recommendation(
        context_data=payload.context_data.model_dump()
    )
    return DecisionResponse(recommendation=recommendation)


@router.get("/crowd", response_model=CrowdResponse)
@limiter.limit("30/minute")
async def get_crowd_metrics(request: Request) -> CrowdResponse:
    """
    Retrieves current simulated crowd metrics.

    Args:
        request: FastAPI request object.

    Returns:
        CrowdResponse containing a list of zone densities.
    """
    from services.crowd_service import get_zones

    return CrowdResponse(zones=get_zones())


@router.post("/sustainability", response_model=SustainabilityResponse)
@limiter.limit("10/minute")
async def sustainability_endpoint(
    request: Request, payload: SustainabilityRequest
) -> SustainabilityResponse:
    """
    Calculates the carbon footprint of fan travel.

    Args:
        request: FastAPI request object.
        payload: Details of travel mode and distance.

    Returns:
        SustainabilityResponse with estimated footprint.
    """
    data = await gemini_service.get_sustainability_footprint(payload.travel_mode, payload.distance)
    return SustainabilityResponse(**data)


@router.post("/announce", response_model=dict[str, str])
@limiter.limit("10/minute")
async def announce_endpoint(request: Request, payload: AnnouncementRequest) -> dict[str, str]:
    """
    Generates a PA announcement translated into multiple languages.

    Args:
        request: FastAPI request object.
        payload: Original message and list of target languages.

    Returns:
        Dictionary mapping language codes to translated strings.
    """
    data = await gemini_service.generate_pa_announcement(payload.message, payload.languages)
    return data


@router.post("/briefing", response_model=BriefingResponse)
@limiter.limit("10/minute")
async def briefing_endpoint(request: Request, payload: BriefingRequest) -> BriefingResponse:
    """
    Creates dynamic shift briefings for volunteers.

    Args:
        request: FastAPI request object.
        payload: The volunteer's role and location.

    Returns:
        BriefingResponse containing duties and escalation guidelines.
    """
    data = await gemini_service.generate_shift_briefing(payload.role, payload.location)
    return BriefingResponse(**data)


@router.get("/capabilities", response_model=CapabilitiesResponse)
@limiter.limit("30/minute")
async def get_capabilities(request: Request) -> CapabilitiesResponse:
    """
    Returns the supported capabilities mapped to problem statement requirements.

    Args:
        request: FastAPI request object.

    Returns:
        CapabilitiesResponse with the feature mapping.
    """
    capabilities = [
        Capability(
            name="dynamic crowd management",
            description="Real-time heatmap and density telemetry routing.",
            endpoint="/api/crowd",
            target_personas=["organizer"],
        ),
        Capability(
            name="smart indoor navigation",
            description="Accessibility-aware routing away from high-density zones.",
            endpoint="/api/decision",
            target_personas=["fan", "volunteer"],
        ),
        Capability(
            name="real-time decision support",
            description="AI-driven triage for emergency and operational dispatch.",
            endpoint="/api/decision",
            target_personas=["staff", "organizer", "volunteer"],
        ),
        Capability(
            name="multi-language assistance modules",
            description="Dedicated translation and localized context response.",
            endpoint="/api/multilingual-assist",
            target_personas=["fan", "staff"],
        ),
    ]
    return CapabilitiesResponse(capabilities=capabilities)


@router.post("/multilingual-assist", response_model=MultilingualAssistResponse)
@limiter.limit("20/minute")
async def multilingual_assist_endpoint(
    request: Request, payload: MultilingualAssistRequest
) -> MultilingualAssistResponse:
    """
    Dedicated endpoint for multilingual assistance to fulfill the challenge track explicitly.

    Args:
        request: FastAPI request object.
        payload: MultilingualAssistRequest with query and language.

    Returns:
        MultilingualAssistResponse with the localized text.
    """
    query = f"Translate and localize this query to {payload.target_language}: '{payload.query}'. Context: {payload.context}"
    response_text = await gemini_service.get_fan_assistant_response(
        query=query, user_profile={"language": payload.target_language}
    )
    return MultilingualAssistResponse(response=response_text, language=payload.target_language)
