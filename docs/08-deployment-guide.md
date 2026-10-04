# 08 – Deployment Guide

> **Nothing is deployable yet.** The repository has no Dockerfile, compose file, CI/CD config or environment files. This guide records the planned deployment shape and what is still open. Concrete commands will be added with the first implementation.

## 1. Planned Runtime Components

| Component | Runs as | Notes |
| :--- | :--- | :--- |
| Frontend | Static build (Vite) served by a web server | React |
| Backend API | Long-running service (container) | FastAPI via Uvicorn |
| Pipeline | Worker container | Python + APScheduler; schedule values `TBD` |
| PostgreSQL + pgvector | Container (or managed Postgres with pgvector) | Single database for relational data and vectors |

## 2. Environments

| Environment | Purpose | Status |
| :--- | :--- | :--- |
| Local | Development | Docker Compose (to be added) |
| Staging | Pre-release checks | `TBD` |
| Production | Demo/live | `TBD` |

Hosting provider: `TBD – Requires project/team decision`.

## 3. Configuration

All configuration through environment variables; real values never committed. Planned variables (names are proposals):

| Variable | Used by | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | Backend, Pipeline | Relational DB connection |
| `SECRET_KEY` | Backend | Signing/session secret |
| `API_BASE_URL` | Frontend | Backend base URL |
| `GEOCODER_USER_AGENT` | Pipeline | Identifying User-Agent required by Nominatim usage policy |
| `FEED_URLS` / feed config | Pipeline | Source list (format `TBD`) |
| `ANTHROPIC_API_KEY` | Pipeline | Claude API for optional summaries |

## 4. Deployment Procedure (to be completed)

1. Start PostgreSQL with pgvector. Apply Alembic migrations.
2. Build and deploy Backend with env config.
3. Deploy Pipeline workers and schedule jobs.
4. Build Frontend with `API_BASE_URL`; publish.
5. Smoke test: feed loads, event page shows sources, login/bookmark works.

## 5. CI/CD

None yet. Planned: GitHub Actions to build and test on pull request; deploy on merge to `main` after approval.

## 6. Operations

| Topic | Plan |
| :--- | :--- |
| Logging | Per-feed ingest status, per-stage errors. Tooling `TBD` |
| Monitoring | Feed freshness, geocoder quota usage, pipeline failures. `TBD` |
| Backups | DB backup policy `TBD` |
| Rollback | Redeploy the previous build; DB migration reversal strategy `TBD` |
| Secrets | Environment/secret manager; rotate on exposure |
| Cost control | Cache geocoding and embeddings; limit feed set |
