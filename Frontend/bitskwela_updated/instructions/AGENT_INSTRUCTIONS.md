# Bitskwela Frontend Agent Instructions

Use this as the frontend implementation guide, aligned with:
- `bitskwela_documentation_final.docx`
- `/root/.copilot/session-state/12715dff-fca9-4c1d-86e9-bbe113335d47/plan.md`

## Product scope

Frontend must support:
1. Home + navigation flow
2. Learn Hub + drag-and-drop simulation modules
3. Investment Calculator UX (with backend API integration)
4. Chatbot widget (backend-powered responses)

## Frontend architecture direction

- React + Vite app
- Route namespace should map to backend `/api/v1/*` contracts
- Move business logic to backend APIs over time (calculator and chatbot)
- Keep UI state and backend state clearly separated

## Integration rules

- Use Supabase session token for authenticated API routes
- Public endpoints can be called without token (e.g., health/reference routes)
- Owner-only backend routes must always be called with authenticated user context
- Standardize API client behavior:
  - bearer token injection
  - timeout/retry strategy
  - centralized error mapping (401/403/429/5xx)

## UX and behavior requirements

- Calculator:
  - replace hardcoded projection math with backend `POST /api/v1/calculate/`
  - use backend instruments/rates endpoints for options where applicable
- Chatbot:
  - replace local keyword-response engine with backend `/api/v1/chat/`
  - pass calculator context metadata when available
- Learning progress:
  - persist module progress via backend APIs
  - restore progress on module entry for authenticated users

## Code quality requirements

- Keep reusable UI pieces in components; avoid repeated inline logic blocks
- Keep API calls in service/client layer, not spread across many components
- Preserve existing design language and interaction patterns
- Avoid silent failures; surface actionable UI messages

## Verification checklist per frontend module

- Route behavior still works
- API integration matches contract shape
- Authenticated routes fail gracefully when unauthenticated
- No regressions in core pages (Home, Learn, Simulation, Calculator, Chat)

