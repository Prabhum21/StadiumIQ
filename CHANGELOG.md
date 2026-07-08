# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Core Next.js frontend with dynamic routing and accessible components.
- FastAPI backend with Google Gemini 2.5 integration.
- In-memory cache layer for AI requests.
- Real-time crowd mapping telemetry endpoints.
- Extensive repository documentation in `docs/` mapped to FIFA GenAI criteria.

### Changed
- Refactored frontend `page.tsx` to utilize `DashboardContent.tsx` for cleaner component hierarchy.
- Backend routing now utilizes FastAPI `Depends` for dependency injection.

### Security
- Prompt sanitization layer protecting the Gemini service against prompt injection.
- Rate limiting implemented on all public POST/GET routes.
