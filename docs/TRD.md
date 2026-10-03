# Technical Requirements Document (TRD)

## Geo News / Location-Aware Event Explorer

This document defines the implementation baseline for the approved [PRD](PRD.md). When a technical choice changes, the team must update this document or record the decision in `docs/ARCHITECTURE_DECISIONS.md` before merging incompatible work.

## 1. Architecture Principles

1. Keep the architecture small: three applications and one authoritative database.
2. Build a thin end-to-end slice before deepening any individual subsystem.
3. Make ML-assisted decisions explainable, versioned, measurable, and correctable.
4. Preserve raw provenance and prior published data when processing fails.
5. Treat unknown or ambiguous data as valid states rather than inventing certainty.
6. Use asynchronous scheduled processing without introducing a message broker in the MVP.
7. Keep the core product usable without Release 2 map or summarization features.

## 2. System Context

| Component | Technology | Responsibility |
| :--- | :--- | :--- |
| Web client | React with TypeScript | Reader and administrator interfaces; communicates only with Spring Boot |
| Product API | Java Spring Boot | Authentication, authorization, public event queries, bookmarks, administration commands, stable REST contract |
| Pipeline | Python | Feed polling, normalization, duplicate detection, NLP, geocoding, embeddings, clustering, reconciliation, evaluation |
| Database | PostgreSQL with pgvector | Authoritative application data, processing state, audit history, and embeddings |
| External feeds | Allowlisted RSS feeds | Article metadata and content inputs |
| Geocoder | Fixture-first adapter with a configurable Nominatim-compatible HTTP provider | Place validation and coordinates; always cached and replaceable with fixtures |
| NLP/embedding models | Version-pinned Python models | Entity/location extraction and vector generation |

The frontend never calls the Python pipeline. Spring Boot and Python use the same PostgreSQL database through explicitly owned tables and versioned schema migrations. Cross-component behavior is protected by contract and integration tests.

## 3. Deployable Boundaries

### 3.1 React web application

Responsibilities:

- Public event feed and event detail routes.
- Timeline, provenance, filters, sign-in, bookmarks, and reviewer workflows.
- Accessible loading, empty, partial-data, and error states.
- API client generated from or checked against the API contract.

It does not implement clustering logic, trust client-supplied authorization state, or communicate directly with PostgreSQL, feeds, models, or geocoders.

### 3.2 Spring Boot product API

Responsibilities:

- User registration, authentication, authorization, and profile access.
- Paginated published-event queries and filter validation.
- Event details, timeline projection, and source provenance.
- Bookmark commands and queries.
- Administrator review queries and correction commands.
- Transactional enforcement of correction, audit, and aggregate-update rules.
- Health/readiness endpoints and structured request logging.

It does not run feed polling, model inference, embedding generation, or clustering.

### 3.3 Python pipeline

Responsibilities:

- Allowlisted feed polling and content normalization.
- Idempotent stage orchestration and retry selection.
- Duplicate detection and NLP enrichment.
- Cached geocoding and embedding generation.
- Candidate retrieval, event scoring, cluster assignment, and reconciliation.
- Evaluation commands and report generation.
- Processing metrics and structured stage logging.

The pipeline must expose deterministic functions for unit/evaluation testing even when model inference is involved.

### 3.4 PostgreSQL ownership

- Spring Boot owns identity, bookmarks, public read projections, administration transactions, and audit access.
- Python owns ingestion/enrichment writes, pipeline state, model outputs, and automatic cluster assignments.
- Schema migrations have one ordered history and run before either application starts against a new version.
- Direct table sharing is permitted for this student-sized system, but table ownership and contracts are explicit to avoid accidental coupling.

## 4. Logical Data Model

| Entity | Key fields and purpose | Owner |
| :--- | :--- | :--- |
| `source` | id, name, feed URL, site URL, language, enabled, poll interval | Spring/admin configuration |
| `feed_run` | source, start/end, outcome, item counts, error | Python |
| `article` | source, external ID, canonical URL, title, text, language, published/fetched times, hashes | Python |
| `article_processing` | article, stage, status, attempts, next retry, error code/reason, version, timestamps | Python |
| `entity_mention` | article, normalized entity, type, text span/confidence | Python |
| `place` | normalized name, country/admin hierarchy, coordinates, geocoder evidence | Python |
| `article_location` | article, place or unknown, confidence, extraction/model version, reviewer override | Python/admin correction |
| `article_embedding` | article, vector, model/version, created time | Python |
| `event` | title, topic, location state/place, start/end, status, source count, created/updated time | Python assignment; Spring corrections |
| `event_article` | event, article, membership status/origin, score components, combined score, algorithm version | Python/admin correction |
| `cluster_decision` | article, candidate event, component scores, threshold, decision, configuration version | Python |
| `user_account` | id, email, password hash, role, status, timestamps | Spring |
| `bookmark` | user, event, created time | Spring |
| `admin_audit` | actor, action, reason, target references, before/after data, timestamp | Spring |

### 4.1 Required integrity rules

- Unique source plus external ID when the feed supplies a stable identifier.
- Unique canonical URL hash as a secondary ingestion identity.
- One current processing record per article and stage/version.
- At most one active event membership per article.
- Unique user/event bookmark pair.
- A published event has at least one active article.
- Foreign keys protect provenance; original article deletion is not part of the MVP.
- Embedding dimensions must match the recorded model version.
- Administrative corrections and their audit record commit in one transaction.

### 4.2 Index baseline

- Article: source/external ID, canonical URL hash, published time, processing status.
- Event: status plus updated time, topic plus time, place plus time.
- Event membership: article/status and event/status.
- Processing: stage/status/next retry.
- Bookmarks: user/created time.
- Vector index is added only after representative data and query measurements justify the selected pgvector index type.

The detailed ERD and field-level definitions belong in `docs/DATA_MODEL.md` during implementation planning.

## 5. Processing Pipeline

### 5.1 Stage model

```text
DISCOVERED
  -> NORMALIZED
  -> DEDUPLICATED
  -> ENRICHED
  -> GEOCODED_OR_UNKNOWN
  -> EMBEDDED
  -> CLUSTERED
  -> PUBLISHABLE
```

Each stage records `pending`, `running`, `succeeded`, `retryable_failed`, or `permanent_failed`. A worker claims eligible records using a database transaction and row-locking strategy so two workers cannot process the same stage concurrently.

### 5.2 Ingestion

1. Poll enabled sources according to their configured interval.
2. Parse the feed with strict size, scheme, host, content-type, and timeout controls.
3. Resolve a stable identity from source/external ID and canonical URL hash.
4. Insert new articles or record that a known item was observed again.
5. Store a feed-run summary and individual failures.

Only `http` and `https` URLs from approved source hosts may be fetched. Redirects must remain within the configured policy. Private/link-local addresses and arbitrary administrator-supplied destinations are rejected.

### 5.3 Normalization

- Normalize whitespace and Unicode consistently.
- Preserve original title/text separately from normalized text where licensing and source policy allow storage.
- Convert timestamps to UTC while retaining source time-zone evidence when available.
- Detect language and reject unsupported processing paths explicitly.
- Generate a normalized-title hash and content fingerprint.

### 5.4 Duplicate handling

Exact and near-exact checks run before embeddings:

1. Source/external ID identity.
2. Canonical URL hash.
3. Normalized-title hash within a bounded time window.
4. Content fingerprint similarity.

A duplicate remains a provenance-bearing article record. Duplicate detection prevents redundant expensive processing; it does not erase the source link.

### 5.5 Entity and location extraction

- Extract named entities and location candidates with confidence.
- Distinguish the event location from publisher location and incidental references.
- Normalize place queries and use a cached geocoder response.
- Record geocoder result, model version, confidence, and evidence.
- Select one primary location only when validation rules pass; otherwise store unknown/ambiguous.
- Reviewer overrides take precedence over later automatic reprocessing unless explicitly reset.

### 5.6 Embeddings

- Generate one versioned embedding for each eligible normalized article.
- Batch inference where practical.
- Cache by normalized content hash plus model version.
- Never compare vectors produced by incompatible models or dimensions.

### 5.7 Candidate retrieval and clustering

Candidate retrieval limits comparison to recent events inside a configurable time window. Topic and reliable location constraints narrow candidates but must not exclude legitimate evolving coverage when those signals are missing.

Initial scoring hypothesis:

```text
final_score = 0.55 * semantic_similarity
            + 0.20 * entity_overlap
            + 0.15 * location_compatibility
            + 0.10 * time_proximity
```

The weights and thresholds are configuration versions evaluated against labelled data. The pipeline:

1. Scores candidate events.
2. Records component scores for diagnostic use.
3. Selects the highest-scoring qualifying event.
4. Attaches the article transactionally or creates a new event.
5. Refreshes derived event title/topic/location/time/source-count projections.

An article cannot be silently attached when required evidence is missing. The chosen threshold may vary by ambiguity class only when the rule is documented and evaluated.

### 5.8 Reconciliation and correction

A scheduled reconciliation job compares recent events for possible false splits. Its threshold must be stricter than initial assignment, and qualifying pairs enter the administrator review queue rather than merging automatically. Automatic merges and splits are excluded from the MVP because they are harder to make safely; reviewer merge/split/move operations provide the correction path.

Merge, split, move, and location correction operations must:

- Validate the requested state transition.
- Lock affected records.
- Preserve every article and provenance link.
- Refresh event aggregates.
- Create an audit record with a required reason.
- Commit or roll back as one transaction.

## 6. API Contract Baseline

The implementation plan will define request/response schemas in the repository-root `openapi.yaml`. The minimum endpoint groups are:

| Area | Minimum operations |
| :--- | :--- |
| Authentication | Register, sign in, sign out, current profile |
| Events | Paginated list with filters; published event detail; source timeline |
| Bookmarks | List, add idempotently, remove idempotently |
| Admin sources | List, create/update, enable/disable, trigger one controlled poll |
| Admin review | Processing failures and low-confidence results |
| Admin corrections | Correct location, move article, merge events, split event |
| Operations | Liveness, readiness, version information |

### 6.1 API rules

- Version the public path, beginning with `/api/v1`.
- Use stable machine-readable error codes and a correlation identifier.
- Use cursor pagination where event ordering can change; offset pagination is acceptable for fixed administrative tables.
- Validate filter combinations, date ranges, page size, identifiers, and correction reasons.
- Return only published events from public endpoints.
- Do not expose raw embeddings, password material, internal stack traces, or unrestricted stored article bodies.
- Use optimistic concurrency or version checks for administrative edits that could overwrite another correction.

## 7. Authentication, Authorization, and Security

### 7.1 Roles

- `READER`: manage own profile and bookmarks.
- `ADMIN`: reader permissions plus source configuration, review access, and correction commands.

Public users may read published events. Every state-changing operation requires authentication and appropriate ownership/role checks.

### 7.2 Controls

- Spring Security with server-side sessions stored in PostgreSQL.
- Password hashing using an established adaptive password encoder.
- Authentication uses a Secure, HttpOnly, SameSite cookie; state-changing browser requests require CSRF protection.
- Strict CORS allowlist in deployed environments.
- Server-side request forgery controls for source fetching.
- HTML sanitization and safe rendering of external article content.
- ORM/parameterized queries; no SQL assembled from user filters.
- Rate limiting for authentication and expensive queries.
- Secrets delivered through environment variables or deployment secret storage.
- CI scans committed content for secrets and scans dependencies for known critical vulnerabilities; exceptions require a documented team decision.
- Audit logs must not store passwords, access tokens, full secrets, or unnecessary article/user content.

## 8. Reliability and Error Handling

### 8.1 Retry policy

- Retry only classified transient failures.
- Use bounded exponential backoff with jitter.
- Stop after a configured attempt count and move the item to review.
- Do not retry validation, unsupported-language, or permanently missing-resource errors without a configuration/data change.
- External calls use explicit connection and request timeouts.

### 8.2 Failure isolation

- One feed/item/stage failure does not abort unrelated work.
- Previously published events remain readable when the pipeline is unavailable.
- Spring Boot readiness depends on required product dependencies, not on optional model/geocoder availability.
- Python startup validates model/configuration compatibility before claiming work.

### 8.3 Idempotency

- Feed identity and database uniqueness prevent duplicate ingestion.
- Stage writes use article, stage, and version keys.
- Bookmark add/remove operations tolerate retries.
- Administrative correction requests use transaction/version checks; clients can safely determine the resulting state.

## 9. Observability

All components emit structured logs containing service, environment, version, timestamp, severity, and correlation or job identifiers. Logs must avoid secrets and sensitive payloads.

Minimum operational measurements:

- Feed polls and items discovered by source.
- Stage successes, retries, permanent failures, and processing duration.
- Geocoder/model calls and cache hits.
- Articles assigned to existing versus new events.
- Public API request latency and error counts.
- Low-confidence locations and low-margin cluster decisions.
- Administrative correction counts by type.

The MVP exposes these measurements through structured logs and database-backed administrator queries. A separate metrics/dashboard platform is outside MVP scope.

## 10. Testing Strategy

### 10.1 Unit tests

- URL/title/text normalization and fingerprinting.
- Time and location compatibility functions.
- Entity-overlap and combined scoring functions.
- Candidate-selection rules.
- Event aggregate calculations and state transitions.
- Authorization and domain validation.

### 10.2 Integration tests

- PostgreSQL migrations, constraints, repositories, and pgvector compatibility.
- Feed parsing from fixed fixtures.
- Geocoder/model adapters using deterministic stubs.
- Pipeline claims, retries, stage transitions, and idempotent reprocessing.
- Spring authentication, bookmarks, event queries, and correction transactions.
- Shared data-contract compatibility between Spring Boot and Python.

### 10.3 Evaluation tests

The evaluation command must accept explicit dataset and configuration versions and output:

- Label counts and class distribution.
- Duplicate precision/recall where applicable.
- Pairwise clustering precision, recall, and F1.
- Primary-location accuracy with determinable and unknown/ambiguous classes separated.
- Processing latency summary.
- Before/after comparison for model, feature, weight, or threshold changes.
- Representative false merge, false split, and wrong-location examples.

### 10.4 End-to-end tests

At least one deterministic browser/API scenario must:

1. Ingest a fixture feed.
2. Process articles into multiple events, including duplicate and unknown-location examples.
3. Publish and browse the event feed/detail/provenance.
4. Apply filters.
5. Register/sign in and create/remove a bookmark.
6. Perform one administrator correction and verify its audit entry.

### 10.5 Continuous integration gates

- Formatting and static analysis for Java, Python, and TypeScript.
- Unit and integration tests.
- Migration validation from an empty database.
- API/data-contract checks.
- Small deterministic end-to-end fixture.
- Placeholder scan, secret scan, and dependency-vulnerability checks.

Large model evaluation can run manually before milestone releases to control execution time, but its report is mandatory for model/configuration changes.

## 11. Performance and Capacity Baseline

The student MVP optimizes for correctness and demonstrability rather than internet scale.

- Public event list/detail target: 500 ms p95 on the seeded dataset, excluding client network latency.
- All collection endpoints are paginated with bounded page sizes.
- Candidate comparison is restricted by a recent time window and other safe filters instead of scanning all events.
- Embeddings and geocoder results are cached by content/query and version.
- Expensive event projections may be persisted and refreshed transactionally.
- Index changes require query-plan or timing evidence on representative data.
- A vector index is introduced only after measurements show sequential vector search is inadequate.

The implementation plan must define a realistic seeded-data volume and one repeatable load/performance script before performance work begins.

## 12. Deployment and Environments

### 12.1 Local environment

Docker Compose will start PostgreSQL, Spring Boot, the Python pipeline, and React. A single setup path must initialize migrations and seeded fixtures without manual SQL edits.

### 12.2 CI environment

CI uses an isolated PostgreSQL service and deterministic model/geocoder stubs for routine checks. Version-pinned dependencies and migrations make results reproducible.

### 12.3 Demo/production-like environment

Deploy to one cloud VM or PaaS project. Components may be separate containers but do not require independent scaling. Use HTTPS, restricted database access, environment-specific secrets, backups, and documented restore/start procedures.

### 12.4 Demonstration mode

- Seeded articles exercise duplicates, multiple events in one city, evolving coverage, and unknown locations.
- External responses required by the demo are cached or stubbed.
- Live ingestion is optional and cannot be the only demonstration path.
- A tagged build and recorded fallback are prepared before final presentation.

## 13. Twelve-Week Technical Delivery Plan

| Weeks | Shared vertical outcome | Member 1 - Spring/API | Member 2 - Pipeline/ML | Member 3 - React/quality |
| :--- | :--- | :--- | :--- | :--- |
| 1-2 | Fixture crosses agreed system boundaries | Project skeleton, first migration, health, contract review | Pipeline skeleton, fixture loader, stage contract | App shell, API client pattern, CI/E2E skeleton |
| 3-4 | Allowlisted feed is visible end to end | Article/event internal read API, processing-status queries | Polling, normalization, identity, retry/error records | Internal list/detail states, failure/empty UI, first E2E slice |
| 5-6 | Seed data becomes explainable events | Event schema/projections and read endpoints | Dedup, NER/location, geocoding cache, embeddings, clustering baseline, labels | Event/provenance prototype, evaluation-result presentation support |
| 7-8 | Reader MVP is complete | Auth, bookmarks, filters, published-event contract | Pipeline hardening, event aggregate refresh, baseline metrics | Feed, detail, timeline, filters, auth/bookmarks, accessibility |
| 9-10 | Errors are inspectable and correctable | Admin commands, audit transactions, security/performance tests | Review queues, reconciliation, tuning/evaluation report | Reviewer UX, correction E2E, responsive/accessibility hardening |
| 11-12 | Stable release and reproducible defense | Deployment/API docs, restore/start checks | Final metrics, failure analysis, seeded/cached demo data | Deployment coordination, user/demo docs, full E2E and rehearsal |

### 13.1 Integration rules

- The milestone demonstration is the unit of progress; isolated subsystem completion is insufficient.
- Every task names one owner and one reviewer.
- Interface and schema changes are proposed before dependent code is merged.
- Pull requests include tests and acceptance evidence appropriate to the change.
- No Release 2 feature displaces an unmet core requirement.

## 14. Technical Definition of Done

A change is done when:

1. Its requirement/task identifier and acceptance criterion are clear.
2. Code, migrations, fixtures, tests, and contract/documentation changes are included together.
3. Relevant local and CI checks pass.
4. Failure, authorization, retry, and empty/unknown states are handled where applicable.
5. Logs contain useful context without secrets.
6. Another member reviews the change.
7. The integrated milestone remains demonstrable.

## 15. Required Follow-On Artifacts

The first follow-on file is `docs/WORK_BREAKDOWN.md`, derived from the approved PRD and TRD. Each task must contain:

- Task ID and linked requirement IDs.
- Milestone and deliverable.
- Single owner and reviewer.
- Dependencies and interface impacts.
- Estimate small enough for a short-lived pull request.
- Acceptance evidence and required tests.
- Status and blocking reason.

Before implementation of dependent components, also create:

1. `docs/DATA_MODEL.md` with the ERD, field definitions, constraints, indexes, and state transitions.
2. `openapi.yaml` with schemas, errors, pagination, and examples.
3. `docs/EVALUATION_PLAN.md` with labelling guidance, datasets, metrics, experiment matrix, and result template.
4. `docs/ARCHITECTURE_DECISIONS.md` with concise decision records for authentication, geocoder/model selection, migration ownership, and deployment.
5. `CONTRIBUTING.md` with branches, review rules, test commands, migrations, secrets, and definition of done.

These artifacts should refine this baseline without expanding the approved MVP.
