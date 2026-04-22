# Bitskwela Backend Agent Instructions

Use this as the implementation guide for backend work, based on:
- `bitskwela_documentation_final.docx`
- `/root/.copilot/session-state/12715dff-fca9-4c1d-86e9-bbe113335d47/plan.md`

## Product scope

Build and maintain backend support for:
1. Web3 Financial drag-and-drop simulations
2. Web3 Technical Concepts drag-and-drop simulations
3. Investment Calculator + prediction engine
4. AI chatbot + analytics support

## Architecture decisions (fixed)

- Auth source of truth: **Supabase Auth JWT** validated in Django
- Forecasting mode: **external forecasting microservice** from day one
- API namespace: `/api/v1/*`
- API response shape: `success`, `message`, `data`, `error`

## Module order (strict)

1. Foundation
2. Supabase DB + JWT auth
3. Calculator APIs
4. AI integration
5. Chatbot APIs
6. Learning progress APIs
7. Analytics
8. Hardening (security/caching/observability)
9. Tests and rollout gates
10. Frontend integration + route auth matrix

## Route auth policy

- Public: health and chosen reference endpoints
- Authenticated: calculate/chat/secured APIs
- Owner-only: user-scoped history/progress resources

Always enforce ownership checks on backend.

## Supabase connection rules

- Prefer Session Pooler/IPv4-compatible endpoints when IPv6 is unavailable.
- Use `DATABASE_URL` in `.env` as primary connection source.
- Never hardcode credentials.
- **Safety rule:** ALWAYS ask the user for explicit confirmation before running any SQL that drops tables (e.g., `DROP TABLE`, `DROP SCHEMA`, destructive resets).

## Quality requirements

- Keep business logic in services, not in views.
- Use serializer validation for request contracts.
- No silent failures for auth/AI provider errors.
- Keep API contracts stable and versioned.

## Operational checks per module

- `python manage.py check`
- `python manage.py test`
- Verify endpoint routing + permission behavior

## Optional tooling

```bash
npx skills add supabase/agent-skills
```
