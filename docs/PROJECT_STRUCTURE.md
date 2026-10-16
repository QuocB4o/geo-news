# Geo News — Project Structure

Where everything lives, who owns it, and what is built versus planned. Requirements are not repeated here: see [PRD](PRD.md) (intent), [TRD](TRD.md) (design), [SPEC](SPEC.md) (requirement IDs) and the [Implementation Plan](IMPLEMENTATION_PLAN.md) (phases, gates, work packages `P#-##`).

**Status legend:** ✅ exists · 🚧 scaffold or stub · 📋 planned, not yet created

**Current state:** Phase 1 scaffold. The API serves health/version only, the worker defines stage enums only, the web app renders fixture data.

## 1. Directory Tree

```text
geo-news/
├── apps/
│   ├── api/                       FastAPI product API
│   │   ├── app/main.py            🚧 error envelope, correlation ID, /api/v1/health/{live,ready}, /api/v1/version
│   │   ├── tests/test_health.py   ✅
│   │   ├── pyproject.toml, Dockerfile  ✅
│   │   └── (routers, repositories, admin/correction commands)  📋 P1–P5
│   └── web/                       React + TypeScript + Vite
│       ├── src/main.tsx, App.tsx  ✅ routing
│       ├── src/api.ts             🚧 API client boundary
│       ├── src/data/fixtures.ts   🚧 fixture data used instead of the API
│       ├── src/components/        ✅ Layout, Icon
│       ├── src/pages/             🚧 Feed, EventDetail, Search, Sources
│       ├── src/styles.css         ✅
│       └── (Vitest, Playwright, reviewer screens)  📋
├── workers/
│   └── pipeline/                  Python worker (APScheduler, no broker)
│       ├── src/pipeline/main.py   🚧 entrypoint
│       ├── src/pipeline/stages.py 🚧 Stage and Status enums (TRD §6.1)
│       ├── tests/test_stages.py   ✅
│       └── (ingestion, normalization, dedup, NER/geocoding, embeddings, clustering, evaluation)  📋 P2–P3
├── packages/
│   └── geo_news/                  Shared Python domain/configuration code
│       └── src/geo_news/config.py 🚧 settings
├── db/
│   ├── migrations/                📋 empty (.gitkeep); Alembic history starts with P1-04
│   └── seeds/                     📋 empty (.gitkeep)
├── tests/
│   └── fixtures/                  📋 empty (.gitkeep); deterministic feed/event fixtures
├── docs/
│   ├── PRD.md TRD.md SPEC.md IMPLEMENTATION_PLAN.md  ✅
│   ├── PROJECT_STRUCTURE.md   this file
│   ├── split/                     ✅ per-member task lists (Bao, Phat, Huy)
│   └── adr/                       📋 empty; architecture decision records
├── .github/workflows/ci.yml      🚧 ruff, pytest, web build
├── compose.yaml                   ✅ db (pgvector pg16), api, worker, web
├── .env.example                   ✅ copy to .env; POSTGRES_PASSWORD is required
├── pyproject.toml                 ✅ root tooling config
├── openapi.yaml                   📋 added when the API contract is frozen
```

## 2. Component Boundaries

From [TRD §3](TRD.md#3-system-context). One authoritative database, three deployable applications.

| Component | Path | Owns | Must not |
| :--- | :--- | :--- | :--- |
| Web | `apps/web` | Reader and reviewer UI, API client | Touch the database, feeds, models or geocoder |
| API | `apps/api` | Public queries, validation, corrections, audit transactions | Poll feeds, run models, cluster |
| Worker | `workers/pipeline` | Ingestion, enrichment, clustering, reconciliation, evaluation | Serve the browser API or make authorization decisions |
| Database | `db/` | Schema (Alembic), seeds | Schedule work or call external services |
| Shared | `packages/geo_news` | Configuration and domain code used by API and worker | Hold business logic for only one side |

Table-writing responsibilities stay explicit even though the API and worker share a package: the worker writes pipeline tables, the API writes corrections and audit.

## 3. Ownership

Plan roles map to members as in [split/README.md](split/README.md): Person A → Bao, Person B → Phat, Person C → Huy.

| Area | Owner | Required reviewer |
| :--- | :--- | :--- |
| `apps/api`, `db/migrations` | Bao | Phat |
| `workers/pipeline`, evaluation dataset and command | Phat | Bao |
| `apps/web`, Playwright tests | Huy | Bao |
| `compose.yaml`, `.github/`, `.env.example` | Huy (with Bao) | Bao |
| `packages/geo_news` | Shared; change needs the other side's review | — |
| `docs/` | Team; ADRs for architecture changes | — |

No one approves their own schema, security or evaluation change.

## 4. Where Future Work Lands

| Deliverable | Phase | Target |
| :--- | :--- | :--- |
| First migration, SQLAlchemy models | 1 (P1-04) | `db/migrations`, models in `packages/geo_news` or `apps/api` (decide in the ADR) |
| Fixture feed and events | 1 (P1-08) | `tests/fixtures`, `db/seeds` |
| Source allowlist, feed polling, normalization | 2 | `workers/pipeline`; validation in `apps/api` |
| Article/processing inspection endpoint and screen | 2 (P2-06) | `apps/api`, `apps/web/src/pages` |
| Dedup, NER/location, geocoder adapter, embeddings, scoring | 3 | `workers/pipeline` |
| Event assignment and projections | 3 (P3-08) | `apps/api` / shared transaction code |
| Evaluation command and reports | 3, 5 | `workers/pipeline` |
| Event feed, detail, filters endpoints | 4 | `apps/api` |
| Reader UI, Playwright suite | 4 | `apps/web` |
| Review queue and one audited correction | 5 | `apps/api` and `apps/web` |
| `openapi.yaml` | frozen by Phase 4 | repo root |
| P2 (accounts, map, summaries) | after Week 10 gate | not started; must not displace P0/P1 |

## 5. Documentation Map

| Question | Read |
| :--- | :--- |
| Why, for whom, what is in scope | [PRD](PRD.md) |
| How it is built; data model; pipeline; security | [TRD](TRD.md) |
| What counts as done; requirement IDs; API baseline | [SPEC](SPEC.md) |
| When, in what order, with which gates and risks | [Implementation Plan](IMPLEMENTATION_PLAN.md) |
| Who does which task | [split/](split/README.md) |
| Why an architecture choice was made | `docs/adr/` (empty so far) |

## 6. Layout Conventions

- Public API paths begin with `/api/v1`. Register fixed FastAPI routes before dynamic ones (`/map/events`, not `/events/map`).
- One migration history in `db/migrations`; schema changes need the other side's review.
- Model identifiers, thresholds and weights are configuration, not hard-coded.
- Feed sources live in validated database records, not in an environment variable.
- Secrets come from the environment (`.env` is untracked; see `.env.example`).
- Behavior or configuration changes update the relevant doc in the same pull request.

## 7. Run Locally

```bash
cp .env.example .env            # set POSTGRES_PASSWORD
docker compose up               # db, api (:8000), worker, web
# or web only:
cd apps/web && npm install && npm run dev    # http://localhost:5173
```

Checks: `ruff check .` and `pytest` from the root; `npm run build` and `npm test` in `apps/web`.
