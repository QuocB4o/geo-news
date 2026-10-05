# Member 1 – Backend, Database, Infrastructure

Part of the [work split](README.md). Specs: [architecture](../docs/04-system-architecture.md), [database and API design](../docs/06-database-api-design.md), [deployment guide](../docs/08-deployment-guide.md).

**You own:** the FastAPI product API, authentication, bookmarks, the database schema and its migrations, the development environment, CI and deployment. You also build the grounded summary stage in Phase 4.

**Your first deliverables unblock both teammates:** the Compose environment (BE-01), the schema (BE-02) and the API contract (BE-03). Do these before anything else.

**Note:** the stack is Python, not Java ([04, Consequences](../docs/04-system-architecture.md#consequences)). Plan learning time for FastAPI and SQLAlchemy in Phase 1.

## Tasks

| ID | Task | SRS | Phase | Size | Depends on |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BE-01 | Development environment and backend skeleton | NFR-MAINT-1 | 1 | M | – |
| BE-02 | Database schema v1 and Alembic migrations | FR-ING-2, FR-DUP-1, FR-EMB-1 (storage) | 1 | M | BE-01, D-06 |
| BE-03 | API contract (OpenAPI) | all product FRs | 1 | S | D-09 |
| BE-04 | Continuous integration | NFR-MAINT-1 | 1 | S | BE-01, FE-01 |
| BE-05 | Event read API: feed, detail, articles, sources | FR-FEED-1, FR-EVT-1, FR-PRV-1, FR-SRC-1, FR-LOC-3 | 2 | L | BE-02, BE-03 |
| BE-06 | Search and filters | FR-SRCH-1 | 3 | M | BE-05, PL-13 |
| BE-07 | Authentication | FR-AUTH-1, NFR-SEC-1 | 2 | M | BE-02, D-09 |
| BE-08 | Bookmarks | FR-BKM-1 | 2 | S | BE-07 |
| BE-09 | Integration test suite | FR-AUTH-1, FR-BKM-1, FR-SRCH-1 | 3 | M | BE-05 – BE-08 |
| BE-10 | Map endpoint | FR-MAP-1 | 4 | S | PL-07, PL-14 (gate) |
| BE-11 | Grounded summary stage | FR-SUM-1, NFR-QUAL-3 | 4 | M | PL-10, PL-14 (gate) |
| BE-12 | Deployment | NFR-AVAIL-1 | 4 | M | D-05 |
| BE-13 | Security review and NFR targets | NFR-SEC-1, NFR-PERF-2 | 3 | S | BE-07, D-07 |

Shared: label your third of the evaluation dataset ([PL-08](member-2-pipeline.md)) during Phases 2–3.

## Acceptance Criteria

**BE-01 – Development environment and backend skeleton**
- `docker compose up` starts PostgreSQL 16 with pgvector and the backend; a health endpoint responds.
- `.env.example` lists every variable in [08 §3](../docs/08-deployment-guide.md#3-configuration); no real values are committed.
- Backend follows the controller → service → repository layering from [05 §6](../docs/05-technical-design.md#6-backend-design-principles).
- README's Installation and Running sections are filled in.

**BE-02 – Database schema v1 and Alembic migrations**
- Migrations create every table in [06 §1](../docs/06-database-api-design.md#1-data-model), with the uniqueness rules and indexes listed there.
- The embedding column's dimension matches the model Member 2 reports from the spike (PL-05); until then it is a placeholder that a later migration changes.
- A seed script loads sample sources, articles and events so BE-05 and the frontend can be developed before real events exist.
- Member 2 has reviewed and approved the migration.

**BE-03 – API contract**
- An OpenAPI document covers every endpoint in [06 §2](../docs/06-database-api-design.md#2-api-proposed-restjson), with example responses, the error body format, and pagination.
- An event with `unknown` location has an example.
- Member 3 has reviewed it and can generate mocks from it.
- Later changes to the contract are reviewed by Member 3.

**BE-04 – Continuous integration**
- GitHub Actions runs `ruff` and `pytest` for Python and lint plus Vitest for the frontend on every pull request.
- A failing check blocks merge.

**BE-05 – Event read API**
- `GET /events`, `/events/{id}`, `/events/{id}/articles` and `/sources` return data matching the contract.
- The feed returns events, never raw articles, ordered by last update and paginated.
- Event detail includes the source count and every contributing article with its source name and original link.
- Events with `unknown` location are returned with null coordinates.

**BE-06 – Search and filters**
- `GET /events` accepts `topic`, `country`, `from`, `to` and `q`, alone and combined.
- Tests cover filter combinations and empty results ([07 §5](../docs/07-testing-strategy.md#5-requirement-coverage)).

**BE-07 – Authentication**
- Register and login work; login returns a JWT; passwords are stored only as argon2 or bcrypt hashes.
- Duplicate email, wrong password and malformed input return clear errors without revealing which accounts exist.
- Logout behaves as decided in D-09.

**BE-08 – Bookmarks**
- A logged-in user can add, remove and list bookmarks; adding twice is harmless.
- Requests without a valid token are rejected; a user cannot see or change another user's bookmarks.

**BE-09 – Integration test suite**
- Tests run against a real PostgreSQL in Docker and cover the API–database path, the auth and bookmark flow including unauthorized access, and (with Member 2) pipeline writes being readable through the API.
- External services are mocked.

**BE-10 – Map endpoint** *(only if the gate passes)*
- `GET /events/map` returns only events with `resolved` location and supports the same filters as the feed.
- A test proves `unknown` events never appear.

**BE-11 – Grounded summary stage** *(only if the gate passes)*
- The model receives only the text of the event's own articles; a test asserts this.
- The stored summary carries links to the articles it drew on.
- With `ANTHROPIC_API_KEY` unset or the feature disabled, the pipeline and API work normally and `summary` is `null`.
- A manual review of a sample of summaries, done with Member 2 (PL-15), finds no unsupported claims.

**BE-12 – Deployment**
- Dockerfiles exist for backend, pipeline and frontend; one Compose file runs the whole system on a single machine.
- The smoke test in [08 §4](../docs/08-deployment-guide.md#4-deployment-procedure-to-be-completed) passes on the chosen host.
- The deployment guide's `TBD` commands are replaced with real ones.

**BE-13 – Security review and NFR targets**
- CORS is restricted to the frontend origin; all API inputs are validated; no secret is in the repository.
- The team has agreed numeric targets for NFR-PERF-2 and NFR-AVAIL-1 and they are written into the SRS.
