# Testing Strategy

## Purpose
To ensure code reliability and prevent regressions before code reaches the production environment.

## Architecture
The project employs isolated unit testing environments tailored to the specific technology stacks (Pytest for backend, Jest for frontend).

## Implementation
1. **Backend Tests**: Tests the API logic, middleware layers, and service methods. Located in `backend/tests/`. Run via `pytest`.
2. **Frontend Tests**: Tests UI components, hooks (e.g., Firestore interaction), and accessibility standards. Located in `frontend/__tests__/`. Run via `jest`.

## Evidence
- API logic tests: `backend/tests/test_api.py`
- Service tests: `backend/tests/test_services.py`
- Middleware tests: `backend/tests/test_middleware.py`
- Frontend hooks: `frontend/__tests__/useFirestore.test.ts`
- Frontend UI: `frontend/__tests__/page.test.tsx`

## Tradeoffs
The current test suite focuses heavily on unit tests. There are no end-to-end (E2E) tests simulating a full user journey (e.g., logging in, clicking the map, getting an AI response).

## Future improvements
Integrate Playwright or Cypress for E2E testing to validate the full stack integration.
