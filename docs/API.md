# API Reference Guide

This document lists all active endpoints exposed by the StadiumIQ FastAPI backend.

## Base URL
All API paths are prefixed by `/api`.

---

## Endpoints

### 1. GET `/api/capabilities`
Returns a list of supported capabilities mapped to tournament vertical requirements.
- **Response Schema**: `CapabilitiesResponse`

---

### 2. POST `/api/chat`
Fan assistant interactive chat endpoint.
- **Request Schema**: `ChatRequest` (max message length: 1000)
- **Response Schema**: `ChatResponse`

---

### 3. POST `/api/decision`
Stadium Decision Engine operational dispatcher. Uses `mode` context to determine telemetry analysis rules.
- **Request Schema**: `DecisionRequest`
- **Response Schema**: `DecisionResponse`
- **Supported Modes**:
  - `operations`: Operations dashboard risk trajectory.
  - `emergency`: Incident triage and volunteer dispatch recommendation.
  - `accessibility`: Low-stress path recommendations.
  - `transport`: Public transit and vehicle advice recommendations.

---

### 4. GET `/api/crowd`
Retrieves live simulated zone queue times and density states.
- **Response Schema**: `CrowdResponse`

---

### 5. POST `/api/sustainability`
Calculates transport emissions metrics.
- **Request Schema**: `SustainabilityRequest`
- **Response Schema**: `SustainabilityResponse`

---

### 6. POST `/api/announce`
Translates public announcements into multiple target language outputs.
- **Request Schema**: `AnnouncementRequest`
- **Response Schema**: `dict[str, str]` (mapping language code to text)

---

### 7. POST `/api/briefing`
Generates volunteer shifts guidelines.
- **Request Schema**: `BriefingRequest`
- **Response Schema**: `BriefingResponse`

---

### 8. POST `/api/multilingual-assist`
Translates and localizes fan support inquiries.
- **Request Schema**: `MultilingualAssistRequest`
- **Response Schema**: `MultilingualAssistResponse`

---

### 9. GET `/api/metrics`
Exposes observability, hardware resources, caching, and Gemini usage telemetry.
- **Response Schema**: `dict`
