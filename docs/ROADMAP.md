# Project Roadmap

## Purpose
To outline the strategic technical milestones and future improvements planned for StadiumIQ.

## Architecture Evolution

### Phase 1: Prototype (Current State)
- **Implementation**: Monolithic frontend, decoupled backend, in-memory caching.
- **Evidence**: Existing `frontend/` and `backend/` directories.

### Phase 2: High Availability & Scaling
- **Implementation**: Transition from in-memory cache to Redis. Container orchestration via Kubernetes.
- **Tradeoffs**: Increases DevOps complexity and infrastructure costs.

### Phase 3: Real-Time Data Streaming
- **Implementation**: Replace static REST polling for crowd data with WebSocket/SSE.
- **Tradeoffs**: Harder to scale horizontally compared to stateless REST APIs.

### Phase 4: Edge AI Fallback
- **Implementation**: Deploy quantized local LLMs to stadium edge servers to guarantee decision-engine availability during total internet blackout.
- **Tradeoffs**: Lower reasoning capabilities compared to cloud-based Gemini models.

## Evidence of Baseline
All proposed roadmap items are direct upgrades to the constraints and tradeoffs documented in `ARCHITECTURE.md`, `PERFORMANCE.md`, and `DEPLOYMENT.md`.

## Future improvements
This document will be updated quarterly as milestones are completed.
