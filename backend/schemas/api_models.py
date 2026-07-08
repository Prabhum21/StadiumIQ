"""
Pydantic schemas for the StadiumIQ AI API layer.
Defines all request and response structures to ensure type safety.
"""

from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional


class ChatRequest(BaseModel):
    """Payload for Fan Assistant queries."""

    message: str = Field(..., max_length=1000)
    user_profile: Dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    """Response containing the AI generated answer."""

    response: str


class ContextData(BaseModel):
    """Contextual metadata passed for dynamic decision making."""

    mode: str = Field(default="navigation")
    model_config = {"extra": "allow"}


class DecisionRequest(BaseModel):
    """Payload for incident and operational triage."""

    context_data: ContextData


class DecisionResponse(BaseModel):
    """Structured response for operational decisions."""

    recommendation: Dict[str, Any]


class CrowdZone(BaseModel):
    """Individual zone data for crowd density."""

    name: str
    density: str
    queue_time: int
    trend: str


class CrowdResponse(BaseModel):
    """List of all crowd zones and their density."""

    zones: List[CrowdZone]


class SustainabilityRequest(BaseModel):
    """Payload to calculate travel footprint."""

    travel_mode: str
    distance: float


class SustainabilityResponse(BaseModel):
    """Response containing footprint and green alternatives."""

    footprint_kg: float
    greenest_alternative: str
    saving_vs_driving: str


class AnnouncementRequest(BaseModel):
    """Payload for generating multilingual PA announcements."""

    message: str
    languages: List[str]


class BriefingRequest(BaseModel):
    """Payload for generating volunteer shift briefings."""

    role: str
    location: str


class BriefingResponse(BaseModel):
    """Response containing duties and escalation paths."""

    duties: List[str]
    escalation_path: str
    welcome_phrase: str


class Capability(BaseModel):
    """Represents a single challenge capability mapping."""

    name: str
    description: str
    endpoint: str
    target_personas: List[str]


class CapabilitiesResponse(BaseModel):
    """Response containing all supported capabilities."""

    capabilities: List[Capability]


class MultilingualAssistRequest(BaseModel):
    """Payload for dedicated multilingual assistance."""

    query: str
    target_language: str
    context: Optional[str] = None


class MultilingualAssistResponse(BaseModel):
    """Response containing the translated/localized assistance."""

    response: str
    language: str
