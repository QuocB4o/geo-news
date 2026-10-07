# Geo News — Implementation Specification

| Field | Value |
| :--- | :--- |
| Status | Draft canonical specification |
| Version | 0.2 |
| Last updated | 2026-10-07 |
| Product source | [PRD.md](PRD.md) |
| Technical source | [TRD.md](TRD.md) |

## 1. Purpose

This file is the canonical catalog of implementable requirements, acceptance criteria, and verification evidence. The PRD defines product intent and priority; the TRD defines the technical solution. A requirement is complete only when its acceptance criterion is demonstrated by the evidence in this specification.

Priority meanings:

- **P0:** required for the core research MVP.
- **P1:** required for the review/correction release after P0 is stable.
- **P2:** deferred and must not delay P0/P1.

## 2. Functional Requirements

### 2.1 Ingestion and normalization

| ID | Priority | Requirement | Acceptance criterion |
| :--- | :--- | :--- | :--- |
| FR-ING-01 | P0 | Administrators can configure an allowlisted feed source. | A valid enabled source is polled; unsupported schemes, unapproved hosts, and non-public destinations are rejected. |
| FR-ING-02 | P0 | The pipeline stores source, canonical URL, title, publication time, fetched time, language, and allowed original/normalized content. | A fixture feed produces complete normalized records or an explicit validation outcome. |
| FR-ING-03 | P0 | Reprocessing a known feed item is idempotent. | Repeating ingestion creates no second provenance record for the same source identity. |
| FR-ING-04 | P0 | The system preserves the original article URL and source metadata. | Every accepted or duplicate article remains traceable to a source record and URL. |
| FR-ING-05 | P0 | Unsupported, malformed, or inaccessible items retain a processing outcome. | Stage, error code, reason, attempt count, and timestamps are inspectable without blocking other items. |

### 2.2 Duplicate detection and enrichment

| ID | Priority | Requirement | Acceptance criterion |
| :--- | :--- | :--- | :--- |
| FR-ENR-01 | P0 | Detect exact and near-exact duplicates before expensive model processing. | Source identity, normalized URL, title hash, and content fingerprint checks run before semantic comparison. |
| FR-ENR-02 | P0 | Duplicate detection preserves provenance. | Two sources carrying identical content remain two source articles and expose both links, while reusable processing may be shared. |
| FR-ENR-03 | P0 | Extract entities and a primary event location with confidence and evidence. | Each processed article has entity records plus a resolved, unknown, or ambiguous location outcome. |
| FR-ENR-04 | P0 | Cache and version geocoder/model results. | Repeated equivalent work uses compatible cached output and records provider/model/configuration versions. |
| FR-ENR-05 | P0 | Generate a versioned article embedding. | Successful eligible records expose model version, dimension, content hash, and completion timestamp. |

### 2.3 Event clustering

| ID | Priority | Requirement | Acceptance criterion |
| :--- | :--- | :--- | :--- |
| FR-CLU-01 | P0 | Compare each eligible article with a bounded candidate-event set. | Candidate selection applies a configured recent window and only safe topic/location constraints. |
| FR-CLU-02 | P0 | Score candidates using semantic, entity, location, and time signals. | Every considered candidate stores component scores, combined score, threshold, and configuration version. |
| FR-CLU-03 | P0 | Attach to the best qualifying event or create a new event. | Each publishable article has at most one active membership; the decision is transactional and explainable. |
| FR-CLU-04 | P1 | Identify likely false splits conservatively. | A scheduled job creates review items for candidates passing a stricter threshold and never merges silently. |
| FR-CLU-05 | P0 | Preserve provenance through membership changes. | Move, merge, split, reconciliation, and reprocessing never remove source-article records or links. |

### 2.4 Event experience

| ID | Priority | Requirement | Acceptance criterion |
| :--- | :--- | :--- | :--- |
| FR-EVT-01 | P0 | Show a cursor-paginated feed of published events. | Each card shows title, topic, time, location state, and source count; rejected/incomplete events are excluded. |
| FR-EVT-02 | P0 | Show an event detail page. | The page includes time range, location state, coverage timeline, and direct contributing-article links. |
| FR-EVT-03 | P0 | Combine and clear discovery filters. | Topic, location, source, date, and supported text filters produce deterministic API and UI results. |
| FR-EVT-04 | P0 | Represent uncertain locations truthfully. | Unknown/ambiguous events remain visible without fabricated coordinates. |
| FR-EVT-05 | P0 | Publish included-source information. | Readers can inspect the configured source set and see a non-comprehensiveness disclaimer. |

### 2.5 Review and administration

| ID | Priority | Requirement | Acceptance criterion |
| :--- | :--- | :--- | :--- |
| FR-ADM-01 | P1 | An administrator can inspect questionable results. | Review views expose source articles, stage failures, location confidence/evidence, and clustering scores. |
| FR-ADM-02 | P1 | An administrator can correct location and cluster membership. | Location change, move, merge, and split operations validate state and refresh affected projections atomically. |
| FR-ADM-03 | P1 | Administrative changes are auditable. | Actor, action, reason, target, before/after references, version, and timestamp are recorded in the same transaction. |

### 2.6 Evaluation

| ID | Priority | Requirement | Acceptance criterion |
| :--- | :--- | :--- | :--- |
| FR-EVA-01 | P0 | Maintain a versioned labelled evaluation dataset. | Labels cover duplicates, hard negatives, evolving stories, ambiguous/no locations, and unrelated events in the same place. |
| FR-EVA-02 | P0 | Produce reproducible metrics. | One documented command reports dataset/model/configuration versions, thresholds, duplicate metrics, clustering metrics, location metrics, and latency. |
| FR-EVA-03 | P0 | Prevent unreviewed quality regressions. | Model, feature, weight, or threshold changes include a before/after report and representative failures. |

### 2.7 Deferred capabilities

| ID | Priority | Requirement | Acceptance criterion |
| :--- | :--- | :--- | :--- |
| FR-USR-01 | P2 | A reader can register, sign in/out, and view their profile. | Authentication, ownership, abuse, and browser-security tests pass. |
| FR-USR-02 | P2 | A signed-in reader can add, remove, and list bookmarks. | Operations are authorized, user-specific, and idempotent. |
| FR-MAP-01 | P2 | Show events with validated coordinates on a map. | Resolved events appear; unknown/ambiguous events do not receive markers. |
| FR-SUM-01 | P2 | Generate an optional grounded event summary. | Only stored event-article text is provided to the model; outputs keep source links and the system works when disabled. |

## 3. Non-Functional Requirements

| ID | Area | Requirement | Verification |
| :--- | :--- | :--- | :--- |
| NFR-01 | Reliability | One item/stage failure does not stop unrelated processing or make published events unavailable. | Failure-injection integration test |
| NFR-02 | Idempotency | Feed polling and every pipeline stage tolerate safe retries. | Reprocessing and concurrent-claim tests |
| NFR-03 | Performance | Public list/detail requests meet 500 ms p95 on the declared seeded dataset. | Repeatable performance command and report |
| NFR-04 | Security | Inputs/fetched content are constrained; access is authorized; secrets and sensitive data are not exposed. | Security tests and review checklist |
| NFR-05 | Transparency | Public events expose sources; decisions and evaluation identify data, models, configuration, and limitations. | API/UI tests and release report review |
| NFR-06 | Accessibility | Core reader workflows target WCAG 2.1 AA keyboard, contrast, label, focus, and semantic requirements. | Automated checks plus keyboard/manual review |
| NFR-07 | Maintainability | Schema, API, processing states, and configuration are versioned and covered by automated tests. | CI contract/migration checks |
| NFR-08 | Portability | The P0 system starts through documented containerized commands in a clean environment. | Clean-environment acceptance run |
| NFR-09 | Observability | Services emit structured, safe logs with correlation/job identifiers and inspectable stage outcomes. | Log-schema and failure-path integration tests |
| NFR-10 | Cost control | External calls are cached, rate-limited, bounded, and replaceable with fixtures. | Adapter tests and call-count assertions |

## 4. Required System Behavior

### 4.1 Processing states

An article follows the state sequence defined in the TRD. Each stage outcome includes the processing/configuration version. `retryable_failed` records become eligible only after `next_retry_at`; `permanent_failed` records require a data or configuration change before re-entry.

### 4.2 Duplicate behavior

- Source identity or URL duplication prevents a repeated record for the same source item.
- Cross-source content duplication preserves both articles.
- A duplicate can reuse enrichment and embedding output when content/model versions are compatible.
- The event timeline and source count include all active provenance-bearing articles according to the product rules.

### 4.3 Location behavior

- `resolved`: one validated primary place and coordinates.
- `unknown`: no candidate meets the resolution rule.
- `ambiguous`: meaningful candidates exist but no safe primary choice exists.
- Unknown and ambiguous items can be clustered and listed, but cannot be mapped.
- Reviewer overrides are versioned and protected from automatic overwrite.

### 4.4 Event lifecycle

Minimum states are `draft`, `published`, `under_review`, and `archived`.

- Only `published` events appear publicly.
- A published event must have an active article membership.
- Membership changes recalculate title/topic/location/time/source-count projections.
- Events emptied by a correction are archived rather than silently deleted.

### 4.5 External-service degradation

- Feed outage: record the feed run and retry later.
- Geocoder outage: preserve candidates and use unknown/ambiguous rather than a fabricated place.
- Model failure: record stage failure; do not publish incomplete records.
- Summary provider outage: no effect on P0/P1 behavior.

## 5. API Acceptance Baseline

The final paths and schemas belong in `openapi.yaml`. At minimum:

| Method | Proposed path | Priority | Result |
| :--- | :--- | :--- | :--- |
| GET | `/api/v1/events` | P0 | Cursor-paginated published event feed with filters |
| GET | `/api/v1/events/{event_id}` | P0 | Event detail and derived fields |
| GET | `/api/v1/events/{event_id}/articles` | P0 | Timeline/provenance articles |
| GET | `/api/v1/sources` | P0 | Included source list |
| GET | `/api/v1/health/live` | P0 | Process liveness |
| GET | `/api/v1/health/ready` | P0 | Required-dependency readiness |
| GET | `/api/v1/version` | P0 | Build, schema, and configuration versions |
| GET/POST/PATCH | `/api/v1/admin/sources` | P0/P1 | Controlled source management |
| GET | `/api/v1/admin/review-items` | P1 | Failure and low-confidence queue |
| POST | `/api/v1/admin/events/{event_id}/move-article` | P1 | Audited membership move |
| POST | `/api/v1/admin/events/merge` | P1 | Audited event merge |
| POST | `/api/v1/admin/events/{event_id}/split` | P1 | Audited event split |
| PATCH | `/api/v1/admin/articles/{article_id}/location` | P1 | Audited location correction |
| GET | `/api/v1/map/events` | P2 | Resolved map markers |
| POST | `/api/v1/auth/register` | P2 | Account creation |
| POST | `/api/v1/auth/login` | P2 | Authenticated session/token flow |
| POST | `/api/v1/auth/logout` | P2 | Authentication termination |
| GET/PUT/DELETE | `/api/v1/bookmarks` | P2 | User-specific bookmark operations |

Every error response uses a stable shape containing `code`, safe `message`, and `correlationId`. Validation details may be included without internal stack traces or sensitive values.

## 6. Evaluation Specification

### 6.1 Dataset

- Store dataset metadata, label guidelines, source/time coverage, licence/retention notes, and version.
- Keep the model-selection spike separate from the held-out evaluation set.
- Split by event or chronology so coverage of one real event does not leak between tuning and evaluation.
- Include duplicate pairs, hard negatives, same-city/same-day distinct events, evolving events, ambiguous places, and no-location articles.
- Record label disagreements and adjudication decisions.

### 6.2 Required metrics

- Exact/near-duplicate precision and recall.
- Pairwise clustering precision, recall, and F1.
- A cluster-balanced metric such as B-cubed precision, recall, and F1.
- False-merge and false-split counts with representative examples.
- Primary-location accuracy on determinable articles.
- Resolved, unknown, and ambiguous coverage rates.
- Median and p95 processing latency.
- Raw-article to published-event reduction.

### 6.3 Reproducibility output

The evaluation command records:

- Git revision.
- Dataset version and label counts.
- Model/provider versions.
- Algorithm/configuration version.
- Weights, thresholds, and candidate window.
- Metrics and run duration.
- Representative failure identifiers without prohibited source content.

## 7. Verification Matrix

| Requirements | Primary evidence | Owner |
| :--- | :--- | :--- |
| FR-ING-01–05 | Feed fixtures, SSRF/validation tests, DB integration, retry tests | Pipeline owner |
| FR-ENR-01–05 | Duplicate fixtures, provenance assertions, mocked geocoder/model tests | Pipeline owner |
| FR-CLU-01–05 | Scoring unit tests, labelled evaluation, transactional membership tests | Pipeline + API owners |
| FR-EVT-01–05 | API contract tests and Playwright reader workflow | API + web owners |
| FR-ADM-01–03 | Authorization, transaction, audit, and correction E2E tests | API + web owners |
| FR-EVA-01–03 | Versioned dataset and reproducible before/after report | Pipeline owner |
| FR-USR-01–02 | Authentication, ownership, abuse, and browser E2E tests | API + web owners |
| FR-MAP-01 | Resolved/unknown marker E2E tests | Web owner |
| FR-SUM-01 | Adapter-input assertion, unsupported-claim review, disabled-provider test | Pipeline owner |
| NFR-01–02 | Failure injection, concurrency, and replay tests | API + pipeline owners |
| NFR-03 | Seeded p95 performance report | API owner |
| NFR-04 | Security test suite and threat-review checklist | Team |
| NFR-05 | Provenance UI/API assertions and release-report review | Team |
| NFR-06 | Automated accessibility scan and keyboard review | Web owner |
| NFR-07 | Migration, OpenAPI, formatting, and static-analysis CI gates | Team |
| NFR-08 | Clean Docker Compose acceptance run | Team |
| NFR-09 | Structured-log schema and correlation tests | API + pipeline owners |
| NFR-10 | Cache/rate-limit/call-count tests with fixtures | Pipeline owner |

## 8. Deterministic End-to-End Scenario

The release acceptance scenario must:

1. Start PostgreSQL, API, pipeline, and web from documented commands.
2. Apply migrations and ingest a fixture feed.
3. Process duplicates from two sources without losing either source link.
4. Produce multiple events, including two distinct same-city cases and one unknown-location case.
5. Browse the event feed, apply filters, open details, and follow provenance.
6. Run the evaluation command and record versioned results.
7. For P1, apply one correction and verify membership, projections, and audit history.
8. Complete without live external services by using recorded/stubbed responses.

## 9. Continuous Integration Gates

Minimum pull-request checks:

- Markdown formatting, internal links, and Mermaid rendering.
- Python and TypeScript formatting/static analysis.
- Unit and integration tests.
- Migration from an empty database.
- OpenAPI validation and client/contract compatibility.
- Requirement-ID traceability check.
- Small deterministic end-to-end fixture.
- Secret and dependency-vulnerability scans.

Large model evaluation may run before milestone releases rather than on every commit, but its report is mandatory for model or clustering-configuration changes.

## 10. Work Breakdown Rules

Each implementation task must include:

- Task ID and linked requirement IDs.
- Milestone, single owner, and reviewer.
- Dependencies and interface/schema impact.
- A scope small enough for a short-lived pull request.
- Acceptance evidence and required tests.
- Status and blocking reason.

A task is not complete when only its isolated subsystem works; the integrated milestone must remain demonstrable.
