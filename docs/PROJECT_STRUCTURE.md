# StadiumIQ Folder Organization and Naming Conventions

This document details the project structure, design guidelines, and naming conventions established across the codebase.

## Directory Structure

```
StadiumIQ AI/
├── .github/
│   └── workflows/
│       └── ci.yml             # CI Action pipeline enforcing quality gates
├── backend/
│   ├── api/
│   │   ├── limiter.py         # Rate limiting configurations
│   │   └── routes.py          # FastAPI application routing
│   ├── schemas/
│   │   └── api_models.py      # Strict Pydantic models for request/response validation
│   ├── services/
│   │   ├── crowd_service.py   # Telemetry simulation service
│   │   ├── gemini_prompts.py  # System prompts and default static fallbacks
│   │   └── gemini_service.py  # Central Gemini connector (OfflineEngine + Cache telemetry)
│   ├── utils/
│   │   ├── exceptions.py      # Centralized exception hierarchy
│   │   ├── logging.py         # Structured JSON logging config
│   │   └── sanitize.py        # Input sanitization and prompt injection checks
│   ├── tests/
│   │   ├── conftest.py        # Pytest configuration and shared fixtures
│   │   └── test_*.py          # Backend test coverage modules
│   ├── main.py                # ASGI application server configuration
│   ├── middleware.py          # Telemetry and HTTP Security Header middlewares
│   └── pyproject.toml         # Formatters and Linters rule configurations
├── docs/                      # Extensive engineering and architectural documentations
├── frontend/
│   ├── __tests__/             # Frontend Jest and RTL test suites
│   ├── src/
│   │   ├── app/               # Next.js App Router root layout and pages
│   │   ├── components/        # Shared presentation elements (Map, Header, Sidebar)
│   │   ├── config/            # Environment configurations
│   │   ├── context/           # React Context state layers (AuthContext)
│   │   ├── features/          # Domain-specific UI features (Emergency, Transport, Accessibility)
│   │   ├── hooks/             # Custom React Hooks (Firestore telemetry hooks)
│   │   ├── lib/               # Utility libraries (Firebase, REST helper)
│   │   └── types/             # Strict TypeScript interface declarations
│   ├── package.json           # Frontend dependencies, lint, format and build scripts
│   └── tsconfig.json          # TypeScript strict compilation settings
└── scripts/
    └── bench.py               # Latency and throughput benchmarking tool
```

## Folder Organization Rules

1. **Feature-based modularization (Frontend)**: Keep CSS-in-JS, presentation UI, hooks, and local API calls grouped inside functional domain directories under `src/features/` (e.g. `src/features/emergency/`).
2. **Domain-driven structure (Backend)**: Keep data structures in `schemas/`, operational engines in `services/`, endpoint entries in `api/`, and helpers in `utils/`.
3. **No circular imports**: Services must never import endpoints or API routes. Telemetry metrics are tracked in isolation via the `utils` layer.

## Naming Conventions

- **Python**: PEP-8 compliant. Snake case for files, variables, functions, and module names. PascalCase for Pydantic models, Custom Exception classes, and Service classes.
- **TypeScript/React**: PascalCase for Component files and React Component declarations. CamelCase for utility helper functions, hooks, state variables, and interfaces (prefixed optional by domain names, avoiding prefix `I`).
