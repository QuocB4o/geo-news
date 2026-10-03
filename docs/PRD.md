# Product Requirements Document (PRD)

## Geo News / Location-Aware Event Explorer

| Field | Value |
| :--- | :--- |
| Status | Approved design baseline for implementation planning |
| Delivery window | 12 weeks |
| Team | Three third-year software-engineering students |
| Initial market | Vietnam |
| Product surface | Responsive web application |
| Core stack | React, Spring Boot, Python, PostgreSQL with pgvector |

## 1. Product Summary

Geo News reduces news overload by grouping multiple articles about the same real-world occurrence into one location-aware event. Readers see a consolidated event, its coverage timeline, and every contributing source instead of a feed dominated by duplicate reporting.

The product is deliberately not a general-purpose news platform. Its academic and user value comes from four capabilities: duplicate detection, primary-event-location extraction, explainable event clustering, and source provenance.

### 1.1 Core research question

How can a news system reduce information overload by grouping duplicate coverage into location-aware events while preserving source provenance?

### 1.2 Product promise

For a reader following news in Vietnam, Geo News should make it faster to understand what happened, where it happened, how coverage developed, and which sources reported it.

## 2. Goals and Success Measures

### 2.1 Product goals

1. Replace repeated article cards with one consolidated event.
2. Preserve a transparent path from each event to all contributing articles.
3. Make events discoverable by topic, location, source, and time.
4. Represent uncertain locations honestly instead of forcing every article onto a map.
5. Produce a measurable, reproducible evaluation of clustering and location extraction.
6. Deliver a reliable end-to-end MVP that three students can deploy and demonstrate in 12 weeks.

### 2.2 Release targets

These values are targets for the labelled evaluation set, not claims about production accuracy.

| Measure | MVP target | Evidence |
| :--- | :--- | :--- |
| Exact-duplicate precision | At least 0.98 | Versioned labelled duplicate pairs |
| Event-clustering quality | At least 0.80 pairwise F1 | Precision, recall, F1, dataset version, and threshold report |
| Primary-location accuracy | At least 0.85 on determinable articles | Labelled location set with an explicit unknown/ambiguous class |
| Provenance coverage | 100% of published events expose contributing source links | Automated integration test |
| Duplicate reduction | Reported, not pre-asserted | Raw article count compared with published event count |
| Processing latency | Measured from ingestion to cluster assignment | Median and 95th percentile on the demo dataset |
| Demo reproducibility | A fresh setup can run the seeded core workflow | Documented acceptance run on a clean environment |

Actual results and known limitations must appear in the final report even when a target is missed.

## 3. Users and Needs

### 3.1 Reader

A reader wants to discover significant events without opening many near-identical articles. The reader needs clear event titles, time and place context, contributing sources, and useful filters.

### 3.2 Returning reader

A signed-in reader wants to save an event and revisit it as coverage develops.

### 3.3 Reviewer/administrator

A project reviewer or administrator needs to inspect questionable processing results, correct a primary location, move an article, or merge/split events without directly editing the database.

### 3.4 Project evaluator

A lecturer or assessor needs to see a working system, understand its algorithms and design choices, reproduce its evaluation, and inspect failure cases rather than receiving unsupported accuracy claims.

## 4. Scope

### 4.1 MVP scope

- Vietnam-first coverage.
- Five to fifteen allowlisted RSS feeds.
- Three to five configured topics.
- Responsive desktop and mobile-web layouts.
- Scheduled ingestion rather than real-time streaming.
- Vietnamese and English articles may be ingested only when the selected models are evaluated for those languages. Unsupported languages are retained as rejected/unsupported records rather than silently misprocessed.
- One primary event location per article, with confidence and an explicit unknown state.
- Accounts and bookmarks.
- Reviewer tools for cluster and location corrections.
- A seeded dataset and cached external-service outputs for reliable demonstrations.

### 4.2 Release 2 scope

The following features may begin only after the clustering and location release gates in Section 2.2 are measured and the core workflow is stable:

- Map view for events with validated coordinates.
- Grounded event summaries created only from articles in the event.
- Broader coverage across selected Southeast Asian countries.

### 4.3 Explicit non-goals for the 12-week MVP

- Worldwide coverage or comprehensive news monitoring.
- Native mobile applications.
- Social-network ingestion.
- Real-time streaming infrastructure.
- Personalized recommendation feeds.
- Publisher ranking, political-bias scoring, or automatic truth verdicts.
- Training a foundation model.
- User comments or social features.
- A separate vector database, Kafka, Redis, or a fleet of microservices.
- Fully automatic factuality guarantees for generated text.

## 5. Primary User Journeys

### 5.1 Discover and verify an event

1. The reader opens the event feed.
2. The reader filters by topic, location, source, or publication period.
3. The reader opens an event.
4. The product shows the event title, primary location or unknown status, time range, source count, coverage timeline, and contributing articles.
5. The reader follows an original-source link when more detail is needed.

### 5.2 Save an event

1. The reader signs in.
2. The reader bookmarks an event.
3. The event appears in the reader's saved list.
4. Removing the bookmark updates the list without altering the shared event.

### 5.3 Review a processing error

1. An administrator opens the review queue or an event detail page.
2. The administrator inspects component similarity scores, location confidence, and source articles.
3. The administrator corrects the primary location, moves an article, merges events, or splits an event.
4. The system validates the change, records an audit entry, and refreshes affected event aggregates.
5. The correction remains available as evaluation evidence.

## 6. Functional Requirements

### 6.1 Ingestion and normalization

| ID | Requirement | Acceptance criterion |
| :--- | :--- | :--- |
| FR-ING-01 | Administrators can configure an allowlisted feed source. | A valid enabled feed is polled; an invalid or non-allowlisted URL is rejected. |
| FR-ING-02 | The pipeline stores source, canonical URL, title, publication time, fetched time, language, and normalized text. | A fixture feed produces complete normalized records or an explicit validation failure. |
| FR-ING-03 | Reprocessing the same feed item is idempotent. | Repeating ingestion does not create a second article. |
| FR-ING-04 | The system preserves the original article URL and source metadata. | Every accepted article can be traced to its source record and original URL. |
| FR-ING-05 | Unsupported, malformed, or inaccessible items retain a processing outcome. | Operators can inspect the stage, error code, reason, and attempt count. |

### 6.2 Duplicate detection and enrichment

| ID | Requirement | Acceptance criterion |
| :--- | :--- | :--- |
| FR-ENR-01 | Detect exact duplicates before embedding. | Canonical URL, normalized-title hash, and content fingerprint checks run first. |
| FR-ENR-02 | Extract named entities and a primary event location with confidence. | Each processed article has entities plus a validated location or unknown status. |
| FR-ENR-03 | Cache geocoding results. | Repeated normalized place queries do not repeatedly call the external geocoder. |
| FR-ENR-04 | Store model and processing versions. | Results identify the model/configuration that produced them. |
| FR-ENR-05 | Generate and persist one article embedding. | Successful records expose an embedding version and completion timestamp. |

### 6.3 Event clustering

| ID | Requirement | Acceptance criterion |
| :--- | :--- | :--- |
| FR-CLU-01 | Compare new articles with a bounded set of recent candidate events. | Candidate selection applies the configured time window and available topic/location constraints. |
| FR-CLU-02 | Score candidates using semantic, entity, location, and time signals. | The selected decision stores every component score, combined score, threshold, and algorithm version. |
| FR-CLU-03 | Attach the article to the best qualifying event or create a new event. | Exactly one active cluster membership exists for each publishable article. |
| FR-CLU-04 | Identify likely false splits conservatively. | A scheduled job places merge candidates that pass a stricter configured threshold into the administrator review queue; it does not merge automatically. |
| FR-CLU-05 | Preserve provenance through all cluster changes. | Moving, merging, or splitting never removes original article references. |

### 6.4 Event experience

| ID | Requirement | Acceptance criterion |
| :--- | :--- | :--- |
| FR-EVT-01 | Show a paginated feed of published events rather than raw articles. | Each card shows title, topic, time, location state, and source count. |
| FR-EVT-02 | Show an event detail page. | The page includes timeline entries and direct links to contributing articles. |
| FR-EVT-03 | Filter events. | Topic, location, source, and date filters can be combined and cleared. |
| FR-EVT-04 | Represent uncertain location truthfully. | Unknown events remain visible in lists but have no fabricated coordinates. |
| FR-EVT-05 | Exclude incomplete or rejected events from public responses. | Public endpoints return only records in the published state. |

### 6.5 Identity, bookmarks, and administration

| ID | Requirement | Acceptance criterion |
| :--- | :--- | :--- |
| FR-USR-01 | A user can register, sign in, sign out, and access their profile. | Authentication flows pass API and browser acceptance tests. |
| FR-USR-02 | A signed-in reader can add and remove bookmarks. | Bookmark operations are authorized, idempotent, and user-specific. |
| FR-ADM-01 | An administrator can inspect questionable results. | Review views expose articles, provenance, location confidence, and clustering scores. |
| FR-ADM-02 | An administrator can correct cluster membership and location. | Merge, split, move, and location-change actions update aggregates consistently. |
| FR-ADM-03 | Administrative changes are auditable. | Actor, action, reason, before/after references, and timestamp are recorded. |

### 6.6 Evaluation

| ID | Requirement | Acceptance criterion |
| :--- | :--- | :--- |
| FR-EVA-01 | Maintain a versioned labelled evaluation dataset. | Labels include positive pairs, hard negatives, evolving stories, ambiguous locations, and unrelated events in the same place. |
| FR-EVA-02 | Produce reproducible metrics. | A documented command reports dataset/model versions, thresholds, precision, recall, F1, location accuracy, and processing latency. |
| FR-EVA-03 | Prevent unreviewed metric regressions. | Model or threshold changes include a before/after evaluation report. |

## 7. Product Rules

1. A published event always contains at least one active source article.
2. An article belongs to at most one active event at a time.
3. Unknown location is valid; guessed coordinates are not.
4. The event time range is derived from contributing articles and refreshes after membership changes.
5. Original article content and provenance are immutable except for controlled refetch/version behavior.
6. Administrative corrections require a reason and audit record.
7. A summary, if Release 2 is approved, must be derived only from the event's stored articles and must retain source links.

## 8. Non-Functional Requirements

| ID | Area | Requirement |
| :--- | :--- | :--- |
| NFR-01 | Reliability | Failure in one pipeline item must not stop unrelated items or make previously published events unavailable. |
| NFR-02 | Idempotency | Feed polling and every pipeline stage must tolerate safe retries. |
| NFR-03 | Performance | On the seeded dataset, public list/detail API requests should meet a 500 ms p95 target excluding client network latency. |
| NFR-04 | Security | Passwords are hashed; endpoints enforce role and ownership; secrets are not committed; inputs and fetched content are validated/sanitized. |
| NFR-05 | Transparency | Public events expose sources; evaluation reports identify data, model, configuration, and limitations. |
| NFR-06 | Accessibility | Core reader workflows target WCAG 2.1 AA keyboard, contrast, label, and semantic-structure requirements. |
| NFR-07 | Maintainability | Database, API, and pipeline contracts are versioned and covered by automated tests. |
| NFR-08 | Portability | The full MVP starts through documented containerized local commands and can be deployed to one VM or PaaS environment. |
| NFR-09 | Observability | Services emit structured logs with correlation identifiers; pipeline stage counts and failures are inspectable. |
| NFR-10 | Cost control | External API calls are cached, rate-limited, and replaceable with seeded responses for development and demonstrations. |

## 9. Release Plan

### Milestone 1 - Foundation (Weeks 1-2)

- Freeze scope, source list, topics, and supported languages.
- Approve ERD, API contract, pipeline contract, and repository conventions.
- Create Spring Boot, Python, React, PostgreSQL, CI, and local container skeletons.
- Demonstrate a fixture record moving across the agreed boundaries.

**Exit condition:** all applications start from documented commands; contract and migration tests run in CI.

### Milestone 2 - Ingestion slice (Weeks 3-4)

- Poll fixture and selected live feeds.
- Normalize and validate articles idempotently.
- Persist processing state and errors.
- Serve and render a minimal internal article/event view.

**Exit condition:** an allowlisted feed reaches the database, Spring API, and React UI without manual database changes.

### Milestone 3 - Intelligence baseline (Weeks 5-6)

- Implement exact duplicate detection.
- Extract entities and primary locations; cache geocoding.
- Generate embeddings and implement the first clustering baseline.
- Label the first evaluation dataset and publish baseline metrics.

**Exit condition:** the seeded dataset produces explainable events and a reproducible baseline report.

### Milestone 4 - Product MVP (Weeks 7-8)

- Publish the event feed and detail page.
- Add timeline, provenance, filters, authentication, and bookmarks.
- Complete core accessibility and responsive behavior.

**Exit condition:** a reader can complete both primary reader journeys end to end.

### Milestone 5 - Quality and correction (Weeks 9-10)

- Add reviewer inspection and correction workflows.
- Implement retries, review queue, audit records, security hardening, and performance checks.
- Tune clustering only against versioned evaluation evidence.
- Decide whether map or grounded-summary work qualifies for Release 2.

**Exit condition:** core release targets are measured; failures and corrections are demonstrable; no critical security or data-integrity defects remain.

### Milestone 6 - Release (Weeks 11-12)

- Deploy the system and validate a clean installation.
- Complete evaluation results, limitations, diagrams, and operating instructions.
- Seed deterministic demonstration data and cache external responses.
- Rehearse the live scenario and prepare a recorded fallback.

**Exit condition:** tagged release, reproducible evaluation, stable demonstration, and complete handoff documentation.

## 10. Team Ownership and Collaboration

| Member | Primary ownership | Cross-team obligation |
| :--- | :--- | :--- |
| Member 1 | Spring Boot API, authentication, migrations, bookmarks, administration endpoints | Define contracts with Member 2; own integration and security test coverage |
| Member 2 | Ingestion, normalization, NLP, geocoding, embeddings, clustering, evaluation | Publish fixtures and processing contracts; document models and limitations |
| Member 3 | React UX, event discovery, provenance, filters, reviewer interface | Own browser E2E coverage, accessibility, deployment, and demo workflow |

Work is integrated by milestone, not postponed until each specialist finishes. A task is complete only when its producer, contract, API/UI consumer, tests, and documentation are merged. Pull requests require at least one teammate review. Schema and interface changes require review by each affected owner.

## 11. Product Risks

| Risk | Product response |
| :--- | :--- |
| Wrong location | Store confidence and validation evidence; allow unknown; provide reviewer correction. |
| False event merge | Use multiple signals, record decision evidence, add hard negatives, and provide split/move tools. |
| False event split | Reconcile recent events conservatively and provide merge tools. |
| Biased or incomplete source set | Publish the configured source list and avoid claims of comprehensive coverage. |
| Feed or geocoder unavailable | Use bounded retries, caching, processing status, and a seeded offline dataset. |
| AI-generated unsupported claims | Keep summaries outside the MVP; require retrieval-only grounding and provenance if later approved. |
| Scope creep | Enforce explicit non-goals and release gates; new features must replace work or move to Release 2. |
| Uneven team workload | Track task estimates, dependencies, reviews, and milestone integration in a shared work breakdown. |
| Demo failure | Use deterministic data, cached external responses, deployment rehearsal, and a recorded fallback. |

## 12. Definition of MVP Done

The MVP is done when:

1. Every MVP functional requirement has passing acceptance evidence.
2. The seeded end-to-end workflow succeeds on a fresh environment.
3. Actual clustering and location metrics are reproducible and documented.
4. Public events preserve complete source provenance.
5. Core error, authorization, retry, and correction paths have automated coverage.
6. No unresolved critical security, data-integrity, or deployment defects remain.
7. All three members can explain the architecture, data model, clustering decision, metrics, limitations, and demo workflow.

## 13. Required Planning Artifacts

The next implementation-planning artifact should be `docs/WORK_BREAKDOWN.md`. It will decompose these requirements into tasks with identifiers, owner, reviewer, dependencies, estimate, milestone, acceptance evidence, and status. Supporting artifacts should include `docs/DATA_MODEL.md`, `openapi.yaml`, `docs/EVALUATION_PLAN.md`, `docs/ARCHITECTURE_DECISIONS.md`, and `CONTRIBUTING.md`.
