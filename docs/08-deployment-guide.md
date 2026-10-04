# 08 – Deployment Guide

> **Nothing is deployable yet.** The repository has no Dockerfile, compose file, CI/CD config or environment files. This guide records the planned deployment shape and what must be decided. Concrete commands will be added once the stack is chosen.

## 1. Planned Runtime Components

| Component | Runs as | Notes |
| :--- | :--- | :--- |
| Frontend | Static build served by web server/CDN | Framework `TBD` |
| Backend API | Long-running service | Java or FastAPI (`TBD`) |
| Pipeline | Scheduled job(s) / worker | Python; poll + cluster + re-merge schedule `TBD` |
| Relational DB | Managed or containerized | Engine `TBD` |
| Vector store | Managed or containerized / DB extension | `TBD` |

## 2. Environments

| Environment | Purpose | Status |
| :--- | :--- | :--- |
| Local | Development | `TBD` (compose-based setup proposed) |
| Staging | Pre-release checks | `TBD` |
| Production | Demo/live | `TBD` |

Hosting provider: `TBD – Requires project/team decision`.

## 3. Configuration

All configuration through environment variables; real values never committed. Planned variables (names are proposals):

| Variable | Used by | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | Backend, Pipeline | Relational DB connection |
| `VECTOR_STORE_URL` | Pipeline, Backend | Vector store (if separate) |
| `SECRET_KEY` | Backend | Signing/session secret |
| `API_BASE_URL` | Frontend | Backend base URL |
| `GEOCODER_API_KEY` | Pipeline | Geocoding provider key |
| `FEED_URLS` / feed config | Pipeline | Source list (format `TBD`) |
| `SUMMARIZER_API_KEY` | Pipeline | Only if a hosted summarization model is used |
| `MAPBOX_TOKEN` | Frontend | Only if Mapbox is chosen |

## 4. Deployment Procedure (to be completed)

1. Provision DB (and vector store). Apply migrations: `TBD`.
2. Build and deploy Backend with env config.
3. Deploy Pipeline workers and schedule jobs.
4. Build Frontend with `API_BASE_URL`; publish.
5. Smoke test: feed loads, event page shows sources, login/bookmark works.

## 5. CI/CD

None. Proposed: build + test on pull request; deploy on merge to `main` after approval. Platform `TBD`.

## 6. Operations

| Topic | Plan |
| :--- | :--- |
| Logging | Per-feed ingest status, per-stage errors. Tooling `TBD` |
| Monitoring | Feed freshness, geocoder quota usage, pipeline failures. `TBD` |
| Backups | DB backup policy `TBD` |
| Rollback | Redeploy the previous build; DB migration reversal strategy `TBD` |
| Secrets | Environment/secret manager; rotate on exposure |
| Cost control | Cache geocoding and embeddings; limit feed set |
