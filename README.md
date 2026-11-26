# AI-Powered Customer Success Platform

A small customer success tool: track customers, log meetings/interactions with them, and
turn meeting notes into structured AI insights (summary, sentiment, action items, risks).
Includes a dashboard with sentiment breakdown and a list of customers flagged for negative
sentiment. Built as a full-stack technical assessment.

## Stack

**Frontend** — Next.js 16 (App Router, Turbopack), TypeScript, Redux Toolkit, Tailwind CSS
**Backend** — FastAPI, PostgreSQL + SQLAlchemy + Alembic, Redis, JWT auth
**Infra** — Docker Compose (postgres, redis, backend, frontend)

## Architecture & decisions

**Layering.** Routers only parse the request and call a service; services hold the business
logic and RBAC checks; repositories hold the SQLAlchemy queries. Nothing reaches across
layers — a router never touches the DB session directly, and a service never builds a query
itself. This is mostly so the business logic can be unit-tested without spinning up FastAPI,
and so an RBAC check can't accidentally get skipped by a route that forgot to call it.

**Roles.** Two roles: `admin` and `user`. A `user` only ever sees/modifies customers (and
their interactions) where `owner_id` is their own id; an `admin` sees everything. The scoping
rule itself lives in one place (`app/core/rbac.py::owner_scope`) and every service that needs
it calls that helper, instead of each service re-implementing (or worse, reaching into) the
same check.

**Auth.** JWT access token, stored in `localStorage`, sent as `Authorization: Bearer`. No
refresh token — the token just expires (`ACCESS_TOKEN_EXPIRE_MINUTES`) and the user logs back
in. This was a deliberate tradeoff for the time budget: `localStorage` is simpler to wire up
than httpOnly cookies but is readable by any injected script, and a single long-lived token
is simpler than a refresh-token flow but means no silent renewal and no server-side
revocation before expiry. A production version of this should move to httpOnly + Secure +
SameSite cookies and add a refresh-token table with rotation.

**AI integration.** The AI call is behind an `AIProvider` interface, with `OpenAIProvider` as
the implementation — the name is a bit of a misnomer since it works against *any*
OpenAI-compatible chat completions endpoint, not just OpenAI's. It's been run against both
OpenAI and Groq just by changing `AI_API_BASE_URL`/`AI_MODEL_NAME`. The prompt text lives in
its own module (`app/services/ai/prompts.py`) separate from the HTTP/retry logic in
`app/services/ai/provider.py` — one file owns *what* we ask the model, the other owns *how*
we call it.

For response handling: the model is asked for a single JSON object and the response is
validated against a Pydantic schema. If it comes back malformed, we retry once with a
"return only JSON" correction message before giving up. If generation fails for any reason
(bad key, timeout, still-malformed JSON after retry), that's persisted as an `Insight` row
with `status: "failed"` and an error message — it's a normal 201 response, not a 500. The
frontend just renders the failed state. This was a deliberate choice: a flaky third-party AI
call should never be allowed to take down the interaction page.

Concurrent calls to the AI provider are capped with a `threading.BoundedSemaphore`
(`AI_MAX_CONCURRENT_REQUESTS`, default 5) and a matching bounded `httpx` connection pool, so
a burst of users generating insights at once can't exhaust the provider's rate limit or the
backend's thread pool. A caller that can't get a slot within
`AI_SEMAPHORE_TIMEOUT_SECONDS` gets a clean 502 instead of queuing indefinitely.

**Caching.** The dashboard payload is cached in Redis per scope (per-user for `user`, one
shared entry for `admin`) with a TTL (`DASHBOARD_CACHE_TTL_SECONDS`). Any create/update/delete
on a customer or interaction explicitly invalidates the relevant cache key(s), so a write is
never followed by stale dashboard numbers — the cache only ever goes stale between writes,
for at most the TTL, which is the expected tradeoff of cache-aside.

## Project structure

```
backend/app/
  api/            route handlers (thin — parse request, call service, return)
  core/           config, security, exceptions, RBAC helper, middleware
  models/         SQLAlchemy models
  repositories/   query layer, one per entity
  schemas/        Pydantic request/response models
  services/       business logic + RBAC enforcement
    ai/           prompt text + the AI provider implementation
  alembic/        migrations (source of truth for the schema)

frontend/src/
  app/            Next.js App Router pages (route groups for auth vs protected)
  components/     UI primitives + feature components, by domain
  store/          Redux Toolkit slices + async thunks
  hooks/          shared hooks (pagination, debounce, auth guard)
  lib/            API client, constants
  types/          shared TypeScript types
```

## Running it locally

```bash
docker compose up -d --build
```

- Frontend: http://localhost:3000
- Backend docs (Swagger): http://localhost:8000/docs
- Health check: http://localhost:8000/health

`backend/.env` needs `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET_KEY`, and an `AI_API_KEY` for
whichever OpenAI-compatible provider you're using — see `backend/app/core/config.py` for
every setting and its default.

On every container start (after migrations, before the server starts), `app/seed.py` runs
and idempotently creates a default `admin` account if one with that email doesn't already
exist — so a fresh database always has a working login without a manual step:

```
admin@gmail.com / admin@123
```

Override via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` env vars, or set either to empty to
skip seeding entirely (e.g. for a real production deployment).

## API overview

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create an account, returns a token |
| POST | `/api/auth/login` | Log in, returns a token |
| GET | `/api/auth/me` | Current user's profile |
| POST | `/api/customers` | Create a customer |
| GET | `/api/customers` | List customers (status/search filters, paginated) |
| GET | `/api/customers/{id}` | Customer detail |
| PUT | `/api/customers/{id}` | Update a customer |
| DELETE | `/api/customers/{id}` | Soft-delete a customer |
| POST | `/api/interactions` | Log an interaction |
| GET | `/api/interactions` | List interactions (customer/type/date filters, paginated) |
| GET | `/api/interactions/{id}` | Interaction detail |
| PUT | `/api/interactions/{id}` | Update an interaction |
| POST | `/api/interactions/{id}/insights` | Generate (or regenerate) an AI insight |
| GET | `/api/interactions/{id}/insights` | List insights for an interaction |
| GET | `/api/dashboard` | Aggregated stats, sentiment breakdown, negative-sentiment alerts |

Full request/response shapes are in the Swagger UI at `/docs` once the backend is running.

## What's not done yet

- Not deployed — everything above is verified working through Docker Compose locally, but
  there's no hosted URL yet.
- No demo video yet.
- No automated test suite. Given more time this is the first thing I'd add, starting with
  the RBAC scoping logic and the AI provider's retry/fallback path, since those are the two
  places a silent regression would be hardest to notice by just clicking around the UI.

## If I had more time

- Refresh tokens instead of a single long-lived access token.
- Rate limiting on `/api/auth/login` and `/api/auth/register` specifically (the AI endpoint
  already has concurrency limiting, but brute-force login attempts aren't throttled).
- Move the JWT out of `localStorage` into an httpOnly cookie.
- Soft-delete for interactions, not just customers (currently only customers support it).
