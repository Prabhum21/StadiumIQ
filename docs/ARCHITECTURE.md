# System Architecture & Diagrams

## Purpose
The purpose of StadiumIQ is to provide a highly scalable, decoupled architecture that manages real-time stadium operations, fan navigation, and generative AI integrations. This document provides a visual and technical breakdown of the system layers.

---

## 1. Overall Architecture
Demonstrates the separation of concerns between the Client (Next.js) and Server (FastAPI).

```mermaid
flowchart TD
    subgraph Client [Frontend Layer]
        UI[Next.js UI Components]
        State[React Hooks & Context]
    end
    
    subgraph Server [Backend Layer]
        API[FastAPI Router]
        Service[Gemini Service]
        Cache[(In-Memory Cache)]
    end
    
    UI <-->|HTTP/REST| API
    API --> Service
    Service <--> Cache
```

---

## 2. AI Pipeline
Details the prompt sanitization and fallback mechanisms for the Generative AI engine.

```mermaid
flowchart LR
    Input[Raw User Context] --> Sanitize[Sanitization Filter]
    Sanitize --> Template[Prompt Builder]
    Template --> Gemini[Google Gemini 2.5]
    Gemini -->|Success| Output[Structured JSON]
    Gemini -->|Timeout/Error| Fallback[Static Fallback JSON]
    Output --> Client
    Fallback --> Client
```

---

## 3. Authentication Flow
Outlines the guest and authenticated user flows. *(Note: Auth logic lives in `AuthContext.tsx` on the client side).*

```mermaid
sequenceDiagram
    participant User
    participant NextJS as Frontend AuthContext
    participant Firebase as OAuth Provider
    
    User->>NextJS: Clicks "Sign in with Google"
    NextJS->>Firebase: Request OAuth Token
    Firebase-->>NextJS: Return JWT
    NextJS->>NextJS: Set User State
    NextJS-->>User: Redirect to Dashboard
```

---

## 4. Request Flow
Traces a specific API call (e.g., `/decision`) from client to server.

```mermaid
sequenceDiagram
    participant Client as Next.js Dashboard
    participant API as FastAPI routes.py
    participant Limiter as Rate Limiter
    participant LLM as GeminiService
    
    Client->>API: POST /decision (Context)
    API->>Limiter: Check Quota (10/min)
    Limiter-->>API: Approved
    API->>LLM: get_decision_recommendation()
    LLM->>LLM: Check Cache
    LLM-->>API: Return JSON Decision
    API-->>Client: 200 OK (Response)
```

---

## 5. Deployment Flow
Illustrates the containerized build and execution process.

```mermaid
flowchart TD
    Source[Source Code] --> Builder[Docker Compose]
    Builder -->|Build| FE_Image[Next.js Image]
    Builder -->|Build| BE_Image[FastAPI Image]
    FE_Image -->|Run| Port3000[Port 3000 Container]
    BE_Image -->|Run| Port8000[Port 8000 Container]
```

---

## 6. Component Hierarchy
Displays the structural rendering tree of the frontend React application.

```mermaid
flowchart TD
    Root[page.tsx / Dashboard]
    Root --> Sidebar[Sidebar.tsx]
    Root --> Header[Header.tsx]
    Root --> Content[DashboardContent.tsx]
    
    Content --> Nav[NavigationPanel.tsx]
    Content --> Access[AccessibilityAssistant.tsx]
    Content --> Incident[IncidentSummary.tsx]
    Content --> Map[StadiumMap.tsx]
```

---

## 7. Data Flow
Shows how data is persisted and passed through the application state.

```mermaid
flowchart LR
    Firestore[(Firebase/Firestore)] -->|WebSockets| Hooks[useFirestore.ts]
    Hooks --> State[Dashboard State]
    State --> Components[UI Render]
    Components -->|User Action| API[FastAPI /chat]
    API --> LLM[Gemini]
```

---

## Implementation & Evidence
- **Frontend Layer**: `frontend/src/app/page.tsx`, `frontend/src/context/AuthContext.tsx`.
- **Backend Layer**: `backend/api/routes.py`, `backend/services/gemini_service.py`.
- **Deployment**: `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`.

## Tradeoffs
The architecture strongly favors decoupling (React vs FastAPI). While this introduces network latency between the frontend and backend compared to a monolithic Next.js Server Actions approach, it allows the heavy Python ML/AI ecosystem to be isolated and scaled independently.

## Future improvements
Introduce a message broker (like RabbitMQ or Redis Pub/Sub) in the Data Flow to handle asynchronous incident processing outside of the main HTTP request/response cycle.
