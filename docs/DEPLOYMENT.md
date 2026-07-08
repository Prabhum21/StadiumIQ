# Deployment Guide

## Purpose
To outline the containerized deployment strategy for spinning up StadiumIQ across any cloud provider.

## Architecture
The application uses Docker to create reproducible, immutable artifacts for both the Next.js frontend and FastAPI backend, orchestrated locally via Docker Compose.

## Implementation
1. **Frontend Container**: Defined in `frontend/Dockerfile`. Builds a production-optimized Next.js standalone artifact.
2. **Backend Container**: Defined in `backend/Dockerfile`. Installs Python dependencies and runs uvicorn.
3. **Orchestration**: `docker-compose.yml` binds the frontend (port 3000) and backend (port 8000) together, managing their internal networking.

## Evidence
- Frontend build: `frontend/Dockerfile`
- Backend build: `backend/Dockerfile`
- Multi-container setup: `docker-compose.yml`

## Tradeoffs
Using `docker-compose` is excellent for single-node deployments and local testing, but it is not sufficient for a highly available, self-healing production environment.

## Future improvements
Provide Kubernetes manifests (`deployment.yaml`, `service.yaml`) and Helm charts for deploying the application to a managed K8s cluster (EKS/GKE) for high availability.
