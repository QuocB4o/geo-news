# Member 1 – Platform and API (proposed Person A)

Part of the [work split](README.md). Authority: [PRD](../docs/PRD.md), [TRD](../docs/TRD.md), [SPEC](../docs/SPEC.md), [Implementation Plan](../docs/IMPLEMENTATION_PLAN.md#41-person-a--platform-and-api-lead). Package IDs (`P#-##`) are the plan's.

**You own:** the FastAPI application and its public/admin contracts, the PostgreSQL schema and Alembic migrations, event projections and transaction boundaries, operational endpoints, review/correction commands with audit, API security and performance, and deployment/recovery.

**Your deliverables unblock both teammates:** the schema (P1-04) and the API scaffold and error envelope (P1-03) in Phase 1. The pipeline writes the tables you migrate, so every schema change needs Member 2's review before merge.

**Backup role:** you cover for Member 2 (pipeline).

## Tasks

| ID | Task | Requirements | Gate | Size | Reviewer | Depends on | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| P1-03 | FastAPI scaffold: config, error envelope, correlation ID, health/version endpoints | NFR-07, NFR-09 | G1 | S | Member 2 | – | Not started |
| P1-04 | PostgreSQL + pgvector, SQLAlchemy, Alembic, first migration | NFR-07, NFR-08 | G1 | M | Member 2 | – | Not started |
| P2-01 | Source configuration and destination allowlist validation | FR-ING-01, NFR-04 | G2 | M | Member 2 | P1-04 | Not started |
| P2-06a | Article/processing inspection endpoint *(API half of plan P2-06)* | FR-ING-05 | G2 | S | Member 3 | P1-04, P2-05 | Not started |
| P3-08 | Transactional event assignment and projection refresh | FR-CLU-03, FR-CLU-05 | G3 | M | Member 2 | P1-04, P3-07 | Not started |
| P4-01 | Cursor-paginated published-event endpoint | FR-EVT-01, NFR-03 | G4 | M | Member 3 | P3-08 | Not started |
| P4-02 | Event detail, source timeline and included-source endpoints | FR-EVT-02, FR-EVT-05, FR-CLU-05 | G4 | S | Member 3 | P4-01 | Not started |
| P4-03 | Topic, location, source, date and text filters | FR-EVT-03 | G4 | M | Member 3 | P4-01 | Not started |
| P4-08 | Seeded API performance measurement | NFR-03 | G4 | S | Member 2 | P4-01 – P4-03, D-08 | Not started |
| P5-01 | Review queue: failures, low-confidence locations, low-margin assignments, proposed merges | FR-ADM-01, FR-CLU-04 | G5 | M | Member 3 | P3-08, P4-04 | Not started |
| P5-02a | One audited location or membership correction *(API half of plan P5-02)* | FR-ADM-02, FR-ADM-03 | G5 | M | Member 2 | P5-01, D-09 | Not started |
| P5-03 | Remaining move / merge / split operations, capacity permitting | FR-ADM-02, FR-CLU-05 | G5 | M | Member 2 | P5-02a | Not started |
| P5-04 | Failure injection, retry, concurrency and log verification | NFR-01, NFR-02, NFR-09 | G5 | M | Member 2 | P4 gate | Not started |
| P5-05 | Security review: source fetching, rendering, inputs, authorization, secrets, errors | NFR-04 | G5 | M | Member 2 | P4 gate | Not started |
| P5-08 | Deployment, backup/restore, rollback and clean-install rehearsal | NFR-08 | G6 | M | Member 3 | P5-04, D-06 | Not started |

Supporting (not owned): you implement the projection refresh used by P3-08 for the pipeline; P1-07 CI and Compose are Member 3's, and you review them.

## Acceptance Criteria

**P1-03 – FastAPI scaffold**
- The API starts from the Compose file; `GET /api/v1/health/live`, `/health/ready` and `/version` respond ([SPEC §5](../docs/SPEC.md#5-api-acceptance-baseline)).
- Every error uses the `code` / safe `message` / `correlationId` shape; a correlation ID is generated if the caller sends none and appears in logs.
- Configuration comes from environment variables listed in [TRD §11.3](../docs/TRD.md#113-configuration-baseline); no secret is in the repository.

**P1-04 – Database and first migration**
- The first migration applies to an empty PostgreSQL 16 with pgvector enabled and creates enough of the [TRD §5](../docs/TRD.md#5-logical-data-model) entities (at least `source`, `article`, `article_processing`, `event`, `event_article_membership`) for the walking skeleton.
- The partial unique constraint "one active membership per article" and the `(source_id, external_id)` uniqueness exist.
- The embedding column dimension is a placeholder until P3-02 reports the model; a later migration sets it.
- Member 2 has approved the migration.

**P2-01 – Source configuration and allowlist validation**
- A valid enabled source is accepted; unsupported schemes, unapproved hosts and non-public destinations (loopback, private, link-local, multicast, metadata service; IPv4 and IPv6) are rejected, with a test matrix.
- The validator lives in the shared package so the poller (P2-02) reuses it, including for DNS re-resolution and each redirect.

**P2-06a – Inspection endpoint**
- A read-only endpoint lists articles with stage, status, error code, reason, attempt count and timestamps, so a failed item is found without SQL.
- It is not exposed publicly; how it is protected in P0 follows D-09. Add it to `openapi.yaml` (it is not in the SPEC §5 baseline).

**P3-08 – Assignment and projections**
- Attach-or-create runs in one transaction; an article has at most one active membership even under two concurrent workers.
- Title, topic, location, time range and source count are recomputed from active memberships in the same transaction.
- No source-article record or link is removed by any assignment or reprocessing.

**P4-01 – Event feed endpoint**
- `GET /api/v1/events` returns only `published` events with cursor pagination and a bounded page size; no embeddings or unrestricted article bodies are returned.
- Unknown and ambiguous events are returned with null coordinates.

**P4-02 – Detail, timeline, sources**
- `GET /events/{id}`, `/events/{id}/articles` and `/sources` match the OpenAPI contract and expose every active contributing article with its source name and original link.
- Fixed routes are registered before dynamic ones ([TRD §7](../docs/TRD.md#7-api-contract-baseline)).

**P4-03 – Filters**
- Topic, location, source, date range and text filters work alone and combined and return deterministic results; invalid ranges and page sizes return validation errors.

**P4-08 – Performance**
- A repeatable command reports p95 for list and detail on the seeded dataset defined in D-08, against the 500 ms target.

**P5-01 – Review queue**
- Items are created for processing failures, low-confidence locations, low-margin cluster decisions and stricter-threshold merge candidates; the reconciliation job never merges silently.

**P5-02a – Audited correction**
- One correction (location or move-article) validates state, uses a version check, refreshes affected projections and writes the audit record (actor, action, reason, target, before/after, version, timestamp) in one transaction.
- A reviewer override survives automatic reprocessing.

**P5-03 – Remaining operations** *(drop at the Week 10 gate if unfinished)*
- Merge, split and the other operations preserve every source article; an emptied event is archived, not deleted.

**P5-04 – Failure and concurrency tests**
- Injected feed, geocoder and model failures do not stop unrelated items or hide published events; replay and concurrent-claim tests pass; logs carry correlation/job IDs and no secrets.

**P5-05 – Security review**
- The [TRD §8](../docs/TRD.md#8-security-and-source-safety) checklist is walked through and findings recorded; CORS is limited to configured origins; no critical finding is open at release.

**P5-08 – Deployment and recovery**
- The system runs on the chosen demo host over HTTPS with restricted database access; backup, restore and rollback are rehearsed from written steps; a clean install passes.

Shared: take part in labelling the evaluation dataset ([P3-01](member-2-pipeline.md)) in Phase 3.
