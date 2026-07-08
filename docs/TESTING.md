# Testing and Verification Strategy

StadiumIQ uses strict quality gates and testing targets to guarantee stability.

## 1. Backend Testing (`pytest`)

The backend contains tests inside `backend/tests/` to verify routers, Gemini responses, caching logic, sanitizers, and telemetry.

### Running Backend Tests
Ensure dependencies are installed, then run:

```bash
cd backend
pytest --cov=. --cov-report=html
```

### Coverage Target
The CI pipeline enforces a minimum of **85% code coverage** via the `--cov-fail-under` flag.

---

## 2. Frontend Testing (`jest`)

Frontend unit and rendering tests are managed by Jest and React Testing Library (RTL).

### Running Frontend Tests
```bash
cd frontend
npm run test:coverage
```

### Accessibility Audits
`jest-axe` checks components within the pipeline to prevent accessibility regressions.
