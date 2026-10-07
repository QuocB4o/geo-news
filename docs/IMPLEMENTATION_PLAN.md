# Geo News — Implementation Plan

| Field | Value |
| :--- | :--- |
| Status | Proposed delivery baseline |
| Version | 1.0 |
| Last updated | 2026-10-07 |
| Delivery window | 12 weeks |
| Team size | Three people |
| Product authority | [PRD.md](PRD.md) |
| Technical authority | [TRD.md](TRD.md) |
| Requirement authority | [SPEC.md](SPEC.md) |

## 1. Executive Summary

The team will deliver Geo News through five gated phases. Each phase ends with an integrated, demonstrable product increment rather than three disconnected subsystem outputs.

The critical path is:

```text
Scope and contracts
  → fixture-driven vertical slice
  → reliable ingestion and provenance
  → evaluated location/clustering pipeline
  → reader experience
  → review, hardening, and release
```

The plan prioritizes the research contribution—provenance-preserving duplicate detection, location extraction, explainable event clustering, and reproducible evaluation. Accounts, bookmarks, maps, generated summaries, and regional expansion remain outside the committed release unless all P0 and P1 gates are met early.

## 2. Objective and Success Definition

### 2.1 Delivery objective

Within 12 weeks, deliver a reproducible Vietnam-first web application that ingests allowlisted news feeds, preserves every source article, groups coverage into explainable location-aware events, exposes the events through a responsive reader experience, and reports measured clustering/location quality.

### 2.2 Release success

The release is successful when:

1. A clean environment starts from documented commands.
2. Seeded feeds run through the real pipeline, database, API, and web application.
3. Published events expose all contributing source links.
4. Unknown and ambiguous locations are represented without fabricated coordinates.
5. The evaluation command reports versioned duplicate, clustering, location, and latency results.
6. One P1 review/correction scenario is completed with an audit record.
7. No critical security or data-integrity issue is open.
8. The team can demonstrate the system without depending on live external services.

The numeric product targets remain those in [PRD §3](PRD.md#3-success-measures). Missing a model-quality target is not automatically a failed project if the evaluation is correct, reproducible, and accompanied by a credible failure analysis.

## 3. Scope and Constraints

### 3.1 Committed scope

- P0 ingestion, normalization, provenance, enrichment, clustering, public event discovery, and evaluation.
- P1 review queue and one complete audited correction path, expanded to other correction operations only if capacity permits.
- Local Docker Compose runtime, CI, deterministic fixtures, and one demo deployment target.

### 3.2 Deferred scope

- Accounts and bookmarks.
- Event map.
- Generated summaries.
- Additional Southeast Asian countries/languages.
- Streaming infrastructure, message brokers, separate vector stores, or independent service scaling.

### 3.3 Delivery constraints

- Three-person team with shared review responsibilities.
- Twelve-week fixed delivery window.
- New implementation; the repository currently contains planning artifacts and placeholders.
- FastAPI/Python pipeline, React/TypeScript, PostgreSQL/pgvector, and Docker Compose baseline.
- Model and geocoder selection must be supported by a Vietnamese/English spike.
- Live feed use depends on source terms and the approved retention policy.

## 4. Recommended Roles for Three People

Roles establish accountability, not silos. Each person owns outcomes and reviews another workstream.

### 4.1 Person A — Platform and API Lead

**Primary accountability:** a reliable, secure, versioned product platform.

Owns:

- FastAPI application and public/admin API contracts.
- PostgreSQL schema ownership and Alembic migrations.
- Event projections, transaction boundaries, and integrity constraints.
- Operational endpoints, configuration, and structured API logging.
- Review/correction commands and audit transactions.
- API security and performance verification.

Secondary responsibilities:

- Reviews pipeline database writes and concurrency behavior.
- Supports deployment and backup/restore validation.
- Acts as backup for the Data Intelligence Lead.

### 4.2 Person B — Data Intelligence and Evaluation Lead

**Primary accountability:** a measurable, reproducible, provenance-safe processing pipeline.

Owns:

- Feed ingestion, normalization, idempotency, and processing state.
- Duplicate detection and reusable processing decisions.
- Entity/location extraction and geocoder adapter/cache.
- Embeddings, candidate retrieval, clustering, and reconciliation.
- Label guidelines, datasets, evaluation command, and metric reports.
- Pipeline reliability, retries, and structured job logging.

Secondary responsibilities:

- Reviews schema changes affecting pipeline contracts.
- Supplies deterministic fixtures to API and web testing.
- Acts as backup for the Platform and API Lead.

### 4.3 Person C — Product Experience and Quality Lead

**Primary accountability:** a usable, accessible, integrated, and demonstrable product.

Owns:

- React application architecture and API client boundary.
- Event feed, detail, timeline, filters, and reviewer experience.
- Loading, empty, partial-data, and error states.
- Responsive behavior and accessibility verification.
- Playwright end-to-end tests and acceptance evidence.
- CI coordination, release checklist, deployment rehearsal, and demo flow.

Secondary responsibilities:

- Facilitates backlog refinement and weekly scope review.
- Reviews public API usability and provenance presentation.
- Acts as backup for release operations and documentation.

### 4.4 Shared responsibilities

All three people share responsibility for:

- Product and scope decisions.
- Source licensing/retention approval.
- Pull-request review.
- Security review.
- Phase demonstrations.
- Release readiness and final presentation.

No person may approve their own high-risk schema, security, or evaluation change.

## 5. Ownership Matrix

| Workstream | Accountable | Required reviewer | Consulted |
| :--- | :--- | :--- | :--- |
| Product scope and priorities | Team | Team | Evaluator/supervisor |
| API and schema | Person A | Person B | Person C |
| Pipeline and processing state | Person B | Person A | Person C |
| Evaluation methodology | Person B | Person C | Person A |
| Reader and reviewer UX | Person C | Person A | Person B |
| Security and source safety | Person A | Person B | Person C |
| Accessibility | Person C | Person A | Person B |
| CI and deterministic E2E | Person C | Person A | Person B |
| Deployment and recovery | Person A | Person C | Person B |
| Release decision | Team | Team | Evaluator/supervisor |

## 6. Delivery Model

### 6.1 Cadence

- Two-week phases aligned with the PRD, except the final release phase, which spans four weeks and has an internal Week 10 gate.
- Daily 10-minute coordination: completed, next, blocked, contract changes.
- Twice-weekly integration window: merge all work against the current vertical slice.
- Weekly 30-minute product review: scope, risks, metrics, and phase confidence.
- End-of-phase demonstration against written exit criteria.
- Retrospective immediately after each gate; only actionable changes enter the next phase.

### 6.2 Work-item standard

Every work item must include:

- One deliverable-oriented title.
- Linked SPEC requirement IDs.
- One accountable owner and one reviewer.
- Dependencies and contract/schema impact.
- Acceptance evidence and required tests.
- Estimate small enough for a short-lived pull request.

### 6.3 Priority policy

1. Restore a broken integrated slice before starting new capability.
2. Complete P0 before P1.
3. Complete evaluation and release evidence before P2.
4. A deadline risk triggers scope reduction, not silent quality reduction.
5. Any new feature requires an explicit trade against existing scope.

## 7. Phase Plan

### Phase 1 — Alignment, Foundation, and Walking Skeleton

**Timeline:** Weeks 1–2  
**Complexity:** High  
**Goal:** Establish the contracts and prove that one deterministic record can cross every system boundary.

#### Entry conditions

- PRD, TRD, and SPEC reviewed by all three people.
- Repository access, branch policy, and development environments available.

#### Work packages

| ID | Deliverable | Owner | Requirements/dependencies |
| :--- | :--- | :--- | :--- |
| P1-01 | Approve feeds, topics, languages, retention policy, evaluation volume, and hosting constraint | Team; Person C facilitates | PRD open decisions |
| P1-02 | Create repository structure, contribution guide, environment example, and development conventions | Person C | TRD repository layout |
| P1-03 | Scaffold FastAPI with safe configuration, error envelope, correlation ID, liveness/readiness/version endpoints | Person A | `NFR-07`, `NFR-09` |
| P1-04 | Scaffold PostgreSQL/pgvector, SQLAlchemy, Alembic, and the first migration | Person A | `NFR-07`, `NFR-08` |
| P1-05 | Scaffold pipeline worker, stage interface, configuration, and structured job logging | Person B | `NFR-01`, `NFR-02`, `NFR-09` |
| P1-06 | Scaffold React app, routing, API boundary, and accessible application shell | Person C | `NFR-06`, `NFR-07` |
| P1-07 | Add Docker Compose and CI for formatting, static analysis, tests, and migration-from-empty | Person C with Person A | `NFR-07`, `NFR-08` |
| P1-08 | Create fixture feed and a temporary deterministic assignment that reaches one event card | Person B with A/C | `FR-ING-01–05`, `FR-EVT-01–02` |

#### Deliverables

- Approved decision record for every PRD Week 1–2 open item.
- Running PostgreSQL, API, worker, and web applications.
- First ordered migration.
- Fixture article stored and exposed through a minimal event response.
- Browser displays one fixture event.
- CI pipeline and clean-start instructions.

#### Verification and gate

Phase 1 passes only when a new team member can clone the repository, run documented commands, apply migrations, load the fixture, and see one event in the browser without manual database edits.

#### Gate decision

- **Go:** contracts and vertical slice are stable enough for ingestion work.
- **Conditional:** non-critical developer-experience gaps have owners and dates.
- **No-go:** components work only in isolation or migration/setup is not reproducible.

### Phase 2 — Reliable Ingestion and Provenance

**Timeline:** Weeks 3–4  
**Complexity:** High  
**Goal:** Convert selected feed items into safe, idempotent, inspectable provenance-bearing articles.

#### Dependencies

- Phase 1 gate passed.
- Feed and retention decisions approved.
- Source fixtures available for all required edge cases.

#### Work packages

| ID | Deliverable | Owner | Requirements |
| :--- | :--- | :--- | :--- |
| P2-01 | Source configuration and destination allowlist validation | Person A + B | `FR-ING-01`, `NFR-04` |
| P2-02 | Feed polling with timeouts, redirect/content limits, and feed-run records | Person B | `FR-ING-01`, `FR-ING-05`, `NFR-01` |
| P2-03 | Deterministic Unicode/text/time/language normalization | Person B | `FR-ING-02` |
| P2-04 | Source identity, normalized URL identity, and replay-safe insertion | Person B + A | `FR-ING-03`, `NFR-02` |
| P2-05 | Provenance preservation and error-state persistence | Person B | `FR-ING-04`, `FR-ING-05` |
| P2-06 | Internal article/processing inspection endpoint and screen | Person A + C | Supports integration and reviewer needs |
| P2-07 | Integration tests for replay, malformed items, unsupported languages, outage, and unsafe URLs | Person B; A reviews | `NFR-01`, `NFR-02`, `NFR-04` |

#### Deliverables

- Persisted `source`, `feed_run`, `article`, and `article_processing` behavior.
- Fixture and approved live-feed adapters behind the same interface.
- Idempotent replay and per-item failure isolation.
- Inspectable processing state without manual SQL.
- Security tests for feed destinations and parser limits.

#### Verification and gate

Replay the same fixture feed at least twice. The database must contain one record per source identity, every source link must remain available, failures must be inspectable, and unrelated items must continue processing.

#### Gate decision

No ML enrichment begins until ingestion identity, provenance, and retry behavior pass integration tests.

### Phase 3 — Intelligence and Evaluation Baseline

**Timeline:** Weeks 5–6  
**Complexity:** Very high  
**Goal:** Produce explainable location-aware events and a reproducible baseline report.

#### Dependencies

- Phase 2 gate passed.
- Labelling guide approved.
- Model-selection spike set separated from held-out evaluation data.
- Data retention permits the selected fixtures/dataset.

#### Work packages

| ID | Deliverable | Owner | Requirements |
| :--- | :--- | :--- | :--- |
| P3-01 | Labelling guide, dataset schema, disagreement/adjudication process | Person B; Person C reviews | `FR-EVA-01` |
| P3-02 | NER, embedding, and geocoder spike on representative Vietnamese/English articles | Person B | `FR-ENR-03–05`, `FR-EVA-02` |
| P3-03 | Exact/near duplicate detection that preserves cross-source articles | Person B | `FR-ENR-01`, `FR-ENR-02` |
| P3-04 | Versioned entity/location extraction with resolved/unknown/ambiguous outcomes | Person B | `FR-ENR-03`, `FR-EVT-04` |
| P3-05 | Cached, replaceable geocoder adapter | Person B; A reviews security | `FR-ENR-04`, `NFR-10` |
| P3-06 | Versioned embedding generation and compatibility checks | Person B | `FR-ENR-05` |
| P3-07 | Bounded candidate retrieval and multi-signal scoring | Person B | `FR-CLU-01`, `FR-CLU-02` |
| P3-08 | Transactional event assignment and projection refresh | Person A + B | `FR-CLU-03`, `FR-CLU-05` |
| P3-09 | Reproducible evaluation command and baseline report | Person B; team reviews | `FR-EVA-02`, `FR-EVA-03` |
| P3-10 | Explainability display for internal inspection | Person C + A | Enables later `FR-ADM-01` |

#### Deliverables

- Selected and version-pinned enrichment models/providers.
- Duplicate, entity, location, embedding, event-membership, and cluster-decision records.
- Stored score components and configuration versions.
- Held-out evaluation split.
- Baseline report covering duplicate metrics, pairwise/B-cubed clustering metrics, false merges/splits, location accuracy/coverage, and latency.

#### Verification and gate

The deterministic dataset must produce multiple events, including:

- Duplicates from two sources with both links preserved.
- Two distinct same-city events that remain separate.
- One evolving story.
- One unknown or ambiguous location.

The baseline evaluation must be reproducible from a documented command. The team may proceed when the pipeline is explainable and measurable even if a numeric target is not yet met.

#### Gate decision

- **Go:** baseline is reproducible and failure cases are understood.
- **Conditional:** target misses have a bounded tuning plan that does not threaten Week 8.
- **No-go:** results cannot be reproduced or provenance is lost.

### Phase 4 — Reader MVP

**Timeline:** Weeks 7–8  
**Complexity:** Medium–High  
**Goal:** Complete the public event-discovery and verification journeys.

#### Dependencies

- Phase 3 produces stable event/read projections.
- Event API schemas are frozen for the phase.
- Deterministic event fixtures include all UI states.

#### Work packages

| ID | Deliverable | Owner | Requirements |
| :--- | :--- | :--- | :--- |
| P4-01 | Cursor-paginated published event endpoint | Person A | `FR-EVT-01`, `NFR-03` |
| P4-02 | Event detail and source timeline endpoints | Person A | `FR-EVT-02`, `FR-CLU-05` |
| P4-03 | Topic, location, source, date, and supported text filters | Person A + C | `FR-EVT-03` |
| P4-04 | Event feed, detail, timeline, provenance, and source disclosure UI | Person C | `FR-EVT-01`, `FR-EVT-02`, `FR-EVT-05` |
| P4-05 | Unknown/ambiguous location and partial-data UI states | Person C | `FR-EVT-04`, `NFR-05` |
| P4-06 | Responsive and accessibility verification | Person C; A reviews | `NFR-06` |
| P4-07 | Reader-journey Playwright suite | Person C | `NFR-08` |
| P4-08 | Seeded API performance measurement | Person A | `NFR-03` |

#### Deliverables

- Public event list, detail, timeline, source list, and filters.
- Accessible loading, empty, success, partial, and failure states.
- Public included-source list and non-comprehensiveness statement.
- Browser acceptance tests and p95 API performance report.

#### Verification and gate

A reader must be able to find an event, combine/clear filters, identify location uncertainty, inspect every contributing source, and follow an original link using keyboard-only navigation on desktop and mobile-width layouts.

#### Gate decision

P1 correction work begins only after both primary reader journeys and the provenance tests pass.

### Phase 5 — Review, Hardening, and Release

**Timeline:** Weeks 9–12  
**Complexity:** High  
**Goal:** Make failures correctable, harden the product, publish evidence, and deliver a repeatable release.

#### Internal Week 10 gate

Weeks 9–10 focus on P1 correction and quality. Weeks 11–12 are reserved for release stabilization; new product capability stops after the Week 10 gate.

#### Work packages

| ID | Deliverable | Owner | Requirements |
| :--- | :--- | :--- | :--- |
| P5-01 | Review queue for failures, low-confidence locations, low-margin assignments, and proposed merges | Person A + B | `FR-ADM-01`, `FR-CLU-04` |
| P5-02 | One complete audited location or membership correction workflow | Person A + C | `FR-ADM-02`, `FR-ADM-03` |
| P5-03 | Remaining move/merge/split operations, capacity permitting | Person A + B + C | `FR-ADM-02`, `FR-CLU-05` |
| P5-04 | Failure injection, retry, concurrency, and log verification | Person A + B | `NFR-01`, `NFR-02`, `NFR-09` |
| P5-05 | Security review of source fetching, rendering, inputs, authorization, secrets, and errors | Person A; team reviews | `NFR-04` |
| P5-06 | Accessibility and performance regression pass | Person C + A | `NFR-03`, `NFR-06` |
| P5-07 | Final held-out evaluation and limitation report | Person B; team reviews | `FR-EVA-02`, `FR-EVA-03`, `NFR-05` |
| P5-08 | Deployment, backup/restore, rollback, and clean-install rehearsal | Person A + C | `NFR-08` |
| P5-09 | Deterministic demo dataset, cached providers, and recorded fallback | Person B + C | `NFR-10` |
| P5-10 | Release candidate, tag, handoff documentation, and presentation rehearsal | Team; Person C coordinates | Release success definition |

#### Deliverables

- Review queue and at least one end-to-end audited correction.
- Security, accessibility, reliability, and performance evidence.
- Final versioned evaluation and limitations report.
- Deployment and recovery instructions.
- Tagged release, deterministic demo, and recorded fallback.

#### Week 10 scope gate

At the end of Week 10:

- Freeze schemas and public API except for release-blocking fixes.
- Drop unfinished P1 operations that are not required for the single complete correction journey.
- Do not start any P2 feature.
- Convert all remaining work to release defects, evidence gaps, or documentation gaps.

#### Final verification and release gate

The complete deterministic scenario in [SPEC §8](SPEC.md#8-deterministic-end-to-end-scenario) must pass from a clean environment. Release requires unanimous team approval that data integrity, provenance, setup, evaluation reproducibility, and demonstration stability are acceptable.

## 8. Milestones and Decision Gates

| Gate | Target | Required outcome | If gate fails |
| :--- | :--- | :--- | :--- |
| G1 — Walking skeleton | End Week 2 | Fixture visible in browser through real DB/API | Stop feature work; repair contracts/setup |
| G2 — Reliable ingestion | End Week 4 | Idempotent, safe, inspectable provenance pipeline | Do not begin ML pipeline integration |
| G3 — Evaluated intelligence | End Week 6 | Explainable events and reproducible baseline | Reduce tuning ambition; preserve measurable baseline |
| G4 — Reader MVP | End Week 8 | Feed/detail/provenance/filters pass E2E | Cut P1 breadth; protect reader journey |
| G5 — Quality freeze | End Week 10 | One correction path and critical hardening complete | Freeze immediately; retain only release blockers |
| G6 — Release | End Week 12 | Tagged, reproducible, deployable, demonstrable system | Present measured partial result with explicit limitations |

## 9. Dependency Map

| Downstream deliverable | Blocking dependencies |
| :--- | :--- |
| Live ingestion | Approved feed list and retention policy |
| Duplicate detection | Stable normalized article identity and fixtures |
| Location evaluation | Label guide, language set, and representative dataset |
| Embeddings | Selected model, content normalization, and version scheme |
| Clustering | Embeddings, entities, location outcomes, time normalization, event schema |
| Reader API | Stable event projections and publication rules |
| Reader UI | Frozen API schemas and deterministic event fixtures |
| Correction workflow | Membership history, audit schema, locking/version strategy |
| Final release | Clean setup, deterministic demo, final evaluation, security/recovery evidence |

Contract or schema changes affecting a downstream owner require that owner's review before merge.

## 10. Quality Strategy

### 10.1 Test pyramid

- Unit: normalization, fingerprints, scoring signals, state transitions, validation, and projections.
- Integration: migrations, PostgreSQL constraints, pipeline claims/retries, API repositories, and external adapters with fixtures.
- Contract: OpenAPI response/error shapes and generated/checked frontend client compatibility.
- End-to-end: deterministic fixture ingestion through browser discovery and P1 correction.
- Evaluation: versioned held-out quality metrics and before/after comparisons.
- Manual: accessibility keyboard pass, failure analysis, security review, and release rehearsal.

### 10.2 Pull-request gates

- Linked requirement IDs and acceptance evidence.
- One teammate approval.
- Formatting/static analysis.
- Relevant unit/integration tests.
- Migration-from-empty when schema changes.
- Contract compatibility when API changes.
- Documentation update when behavior or configuration changes.

### 10.3 Defect severity

| Severity | Meaning | Release treatment |
| :--- | :--- | :--- |
| Critical | Data/provenance loss, exploitable security issue, unrecoverable setup, or unusable core flow | Must fix before release |
| High | Incorrect clustering/location behavior without safe fallback, broken reader journey, or non-reproducible evaluation | Fix or reduce affected scope before release |
| Medium | Partial workflow degradation with workaround | Fix if within phase; otherwise document and schedule |
| Low | Cosmetic or low-impact usability/documentation issue | May defer with explicit record |

## 11. Product and Delivery Metrics

The team reviews these weekly:

| Category | Metric | Purpose |
| :--- | :--- | :--- |
| Delivery | Phase-gate confidence: green/amber/red | Make schedule risk explicit |
| Flow | Work items in progress per person | Prevent too much parallel unfinished work |
| Integration | Age of oldest unmerged branch | Reduce integration risk |
| Quality | Open critical/high defects | Protect release readiness |
| Automation | CI pass rate and deterministic E2E status | Detect unstable foundations |
| Data | Fixture/label coverage by required edge case | Prevent evaluation blind spots |
| Model | Duplicate, clustering, false-merge/split, and location metrics | Track research outcome |
| Product | Provenance coverage and reader-journey E2E result | Track user value |
| Operations | Processing failures, retries, latency, and cache hit rates | Track system reliability/cost |

Velocity or task count is not a success metric by itself; integrated evidence is.

## 12. Assumptions

| ID | Assumption | Status | Validation date/owner |
| :--- | :--- | :--- | :--- |
| A1 | Three people are available throughout the 12 weeks. | Unverified | Week 1 / team |
| A2 | FastAPI/React/PostgreSQL are permitted by the course. | Unverified | Week 1 / Person A |
| A3 | Five-to-fifteen suitable feeds permit the intended access/storage. | Unverified | Week 1 / team |
| A4 | Vietnamese and English models can run on available development/demo hardware. | Unverified | Week 5 spike / Person B |
| A5 | Public or configured geocoding can support the bounded dataset with caching. | Unverified | Week 5 spike / Person B |
| A6 | One VM/PaaS or local demonstration environment is available. | Unverified | Week 2 / Person C |
| A7 | The team can produce enough reliable labels for held-out evaluation. | Unverified | Week 2 / Person B |
| A8 | P2 features are genuinely optional for assessment. | Unverified | Week 1 / team with evaluator |
| A9 | The documented P0/P1 scope matches the assessment rubric. | Unverified | Week 1 / team with evaluator |

## 13. Risk Register

| ID | Risk | Likelihood | Impact | Prevention/mitigation | Contingency |
| :--- | :--- | :--- | :--- | :--- | :--- |
| R1 | Scope exceeds three-person capacity | High | High | Enforce gates, WIP limits, and no P2 before release | Reduce P1 to one complete correction path |
| R2 | Feed terms prevent storing article text | Medium | High | Decide retention in Week 1; use metadata/excerpts/fixtures | Use approved fixtures and store only permitted fields/hashes |
| R3 | Vietnamese NER/location quality is weak | High | High | Early representative spike; unknown/ambiguous state | Narrow language/topic/source scope and report limitations |
| R4 | False merges undermine trust | Medium | High | Multi-signal score, hard negatives, false-merge metric, review flow | Raise threshold and accept more false splits |
| R5 | Evaluation leakage inflates results | Medium | High | Split by event/time; separate spike and held-out data | Rebuild split and republish corrected metrics |
| R6 | API/pipeline schema coupling blocks integration | Medium | High | Contract review, one migration history, twice-weekly integration | Freeze schema and use compatibility adapters temporarily |
| R7 | External services fail during demo | High | Medium | Cached/stubbed responses and deterministic seed | Disable live mode and use recorded scenario |
| R8 | One specialist becomes a bottleneck | Medium | High | Required reviewers, backup roles, shared fixtures/docs | Reassign scope and reduce parallel work |
| R9 | Deployment consumes final weeks | Medium | High | Compose from Week 2; deployment spike before Week 10 | Demonstrate locally with documented reproducibility |
| R10 | Security flaw in feed fetching or content rendering | Medium | High | Allowlist, destination/redirect checks, limits, sanitization, tests | Disable live source/config surface until fixed |
| R11 | Model/runtime hardware is insufficient | Medium | Medium | Benchmark during spike and batch/cache inference | Use a smaller model and disclose quality trade-off |
| R12 | Documentation diverges from behavior | Medium | Medium | PR checklist and docs-as-contract ownership | Block release until critical contract docs match |

## 14. Open Decisions and Escalation Rules

### 14.1 Decisions due by end of Week 1

- Final assessment/rubric alignment.
- Feed and content-retention policy.
- Initial topics and supported languages.
- Team member assignment to Persons A, B, and C.
- Demo/deployment constraint.
- Evaluation dataset ownership and target size.

### 14.2 Escalation triggers

Escalate to the whole team immediately when:

- A requirement or architecture change affects more than one workstream.
- A task is blocked for more than one working day.
- A phase gate becomes amber or red.
- A security, licensing, data-integrity, or evaluation-validity concern appears.
- Completing a new feature would threaten an existing gate.

The team records the decision, owner, date, alternatives, and scope consequence. Architecture decisions go under `docs/adr/`; product changes update the PRD and SPEC.

## 15. First Ten Working Days

### Days 1–2 — Align

- Assign Persons A, B, and C.
- Confirm assessment scope and P2 deferral.
- Approve feed/topic/language/retention decisions or name owners and deadlines.
- Create the issue board using Phase 1 work packages.
- Agree branch, review, and definition-of-done rules.

### Days 3–5 — Scaffold

- Create repository layout and local configuration.
- Start PostgreSQL, FastAPI, pipeline worker, and React shell.
- Add health/version endpoints and first migration.
- Add CI and migration-from-empty verification.
- Create deterministic feed/event fixtures.

### Days 6–8 — Connect

- Load one fixture article through the worker.
- Store it with processing state and provenance.
- Expose a temporary event through the API.
- Render the event card and source link.
- Add the first integration and browser smoke tests.

### Days 9–10 — Stabilize and demonstrate

- Run the clean-checkout setup.
- Fix cross-component contract and environment issues.
- Demonstrate the walking skeleton to the team/evaluator.
- Record Phase 1 gate decision, risks, and Phase 2 commitments.

## 16. Release Readiness Checklist

The team may tag the release only when all mandatory items are true:

- P0 requirements have passing acceptance evidence.
- One complete P1 correction workflow is audited.
- Clean installation and deterministic E2E pass.
- Database migrations apply from empty and through the supported upgrade path.
- Provenance coverage is verified automatically.
- Final evaluation is versioned and reproducible.
- Known limitations and target misses are published.
- No critical security or data-integrity defect is open.
- Accessibility and p95 performance results are recorded.
- Backup/restore or equivalent demo recovery is rehearsed.
- Live external services are not required for the demonstration.
- Tagged build and recorded fallback are available.

## 17. Immediate Next Actions

1. Assign the three recommended roles to named team members.
2. Validate the plan against the course rubric and actual availability.
3. Close or assign every Week 1 open decision.
4. Create the Phase 1 issue board from work packages `P1-01` through `P1-08`.
5. Begin with the clean-environment walking skeleton; do not begin model integration first.
