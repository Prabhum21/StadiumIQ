"""
Pydantic schemas for the StadiumIQ AI API layer.
Defines all request and response structures to ensure type safety.
"""

from typing import Any

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Payload for Fan Assistant queries."""

    message: str = Field(..., max_length=1000)
    user_profile: dict[str, Any] = Field(default_factory=dict)


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

    recommendation: dict[str, Any]


class CrowdZone(BaseModel):
    """Individual zone data for crowd density."""

    name: str
    density: str
    queue_time: int
    trend: str


class CrowdResponse(BaseModel):
    """List of all crowd zones and their density."""

    zones: list[CrowdZone]


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
    languages: list[str]


class BriefingRequest(BaseModel):
    """Payload for generating volunteer shift briefings."""

    role: str
    location: str


class BriefingResponse(BaseModel):
    """Response containing duties and escalation paths."""

    duties: list[str]
    escalation_path: str
    welcome_phrase: str


class Capability(BaseModel):
    """Represents a single challenge capability mapping."""

    name: str
    description: str
    endpoint: str
    target_personas: list[str]


class CapabilitiesResponse(BaseModel):
    """Response containing all supported capabilities."""

    capabilities: list[Capability]


class MultilingualAssistRequest(BaseModel):
    """Payload for dedicated multilingual assistance."""

    query: str
    target_language: str
    context: str | None = None


class MultilingualAssistResponse(BaseModel):
    """Response containing the translated/localized assistance."""

    response: str
    language: str


# ==========================================
# INTERNAL GEMINI RESPONSE SCHEMAS
# ==========================================


class OperationsResultSchema(BaseModel):
    """Schema for Gemini Operations Decision"""

    overall_status: str
    risk_score: int
    priority: str
    recommended_actions: list[str]
    predicted_problems: list[str]
    volunteer_deployment: list[str]
    executive_summary: str
    risk_trajectory: list[str]


class EmergencyResultSchema(BaseModel):
    """Schema for Gemini Emergency Decision"""

    priority: str
    assigned_volunteers: list[str]
    estimated_response: str
    recommended_actions: list[str]
    medical_support: bool
    evacuation_required: bool
    reasoning: list[str]


class AccessibilityResultSchema(BaseModel):
    """Schema for Gemini Accessibility Decision"""

    recommended_route: list[str]
    estimated_time: str
    accessible_facilities: list[str]
    rest_areas: list[str]
    warnings: list[str]
    reasoning: list[str]


class TransportResultSchema(BaseModel):
    """Schema for Gemini Transport Decision"""

    recommended_mode: str
    travel_time: str
    cost_estimate: str
    parking_advice: str
    reasoning: list[str]


class DefaultResultSchema(BaseModel):
    """Schema for Gemini Default Decision"""

    recommended_route: list[str]
    estimated_time: str
    crowd_level: str
    risk_score: int
    recommended_food_stop: str | None
    accessibility_notes: list[str]
    alternative_route: list[str]
    reasoning: list[str] | str


class SustainabilityResultSchema(BaseModel):
    """Schema for Gemini Sustainability calculation"""

    footprint_kg: float
    greenest_alternative: str
    saving_vs_driving: str


class BriefingResultSchema(BaseModel):
    """Schema for Gemini Briefing generation"""

    duties: list[str]
    escalation_path: str
    welcome_phrase: str
