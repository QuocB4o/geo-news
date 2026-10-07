# Geo News — Product Requirements Document

| Field | Value |
| :--- | :--- |
| Status | Draft baseline |
| Version | 0.2 |
| Last updated | 2026-10-07 |
| Delivery window | 12 weeks |
| Team | Three software-engineering students |
| Initial market | Vietnam |
| Product surface | Responsive web application |

## 1. Product Summary

Geo News reduces news overload by grouping reports about the same real-world occurrence into one location-aware event. Instead of a feed dominated by repeated articles, readers see an event, its coverage timeline, where it happened, and every contributing source.

The product is not intended to be a comprehensive news platform. Its academic and user value comes from four capabilities:

1. Duplicate detection.
2. Primary-event-location extraction.
3. Explainable event clustering.
4. Source provenance.

**Research question:** How can a news system reduce information overload by grouping duplicate coverage into location-aware events while preserving source provenance?

## 2. Product Goals

1. Replace repeated article cards with one consolidated event.
2. Preserve a transparent path from every event to all contributing articles.
3. Make events discoverable by topic, location, source, and time.
4. Represent uncertain locations honestly instead of forcing every article onto a map.
5. Produce a measurable and reproducible evaluation of clustering and location extraction.
6. Deliver an end-to-end system that three students can deploy and demonstrate in 12 weeks.

## 3. Success Measures

These are targets for a versioned, labelled evaluation set, not claims about production accuracy.

| Measure | MVP target | Required evidence |
| :--- | :--- | :--- |
| Exact-duplicate precision | At least 0.98 | Labelled duplicate pairs and dataset version |
| Event-clustering quality | At least 0.80 pairwise F1 | Precision, recall, F1, configuration, and threshold report |
| False-merge rate | Report separately and minimize | Reviewed false-merge cases |
| Primary-location accuracy | At least 0.85 on determinable articles | Labelled locations plus unknown/ambiguous class |
| Location coverage | Reported, not pre-asserted | Resolved versus unknown rate |
| Provenance coverage | 100% of published events expose contributing source links | Automated integration test |
| Duplicate reduction | Reported, not pre-asserted | Raw article count versus published event count |
| Processing latency | Measured | Median and p95 from ingestion to cluster assignment |
| Demo reproducibility | Seeded core workflow runs in a clean environment | Documented acceptance run |

Actual results and known limitations must be reported even when a target is missed.

## 4. Users and Needs

### 4.1 Reader

A reader wants to discover significant events without opening many near-identical articles. The reader needs clear event titles, time and place context, contributing sources, and useful filters.

### 4.2 Project evaluator

A lecturer or assessor needs to see a working system, understand its algorithms and design choices, reproduce its evaluation, and inspect failure cases rather than receive unsupported accuracy claims.

### 4.3 Reviewer or administrator

A reviewer needs to inspect questionable processing results and correct a primary location or cluster membership without directly editing the database. A minimal correction workflow is included after the reader experience is stable.

### 4.4 Returning reader

Accounts and bookmarks are useful but do not directly answer the research question. They are a later release capability and must not delay the core evaluation.

## 5. Release Scope

### 5.1 P0 — Core research MVP

- Vietnam-first coverage.
- Five to fifteen allowlisted RSS feeds.
- Three to five configured topics.
- Scheduled ingestion rather than real-time streaming.
- Vietnamese and English processing only after selected models are evaluated for those languages.
- Idempotent normalization and duplicate detection.
- One primary event location per article, with confidence and an explicit unknown state.
- Explainable multi-signal event clustering.
- Public event feed and event detail page.
- Coverage timeline and complete source provenance.
- Topic, location, source, and time filters.
- Versioned evaluation dataset and reproducible evaluation command.
- Seeded data and cached external-service responses for demonstrations.

### 5.2 P1 — Review and correction

- Processing-error and low-confidence review queue.
- Location correction.
- Move an article between events.
- Merge or split events.
- Audit history for administrative changes.

P1 begins only after the P0 reader workflow and evaluation baseline are working.

### 5.3 P2 — Deferred product features

- Accounts and bookmarks.
- Map view for events with validated coordinates.
- Grounded event summaries created only from articles in the event.
- Broader coverage across selected Southeast Asian countries.

### 5.4 Non-goals for the 12-week release

- Worldwide or comprehensive news monitoring.
- Native mobile applications.
- Social-network ingestion.
- Real-time streaming infrastructure.
- Personalized recommendation feeds.
- Publisher ranking or political-bias scoring.
- Automatic truth verdicts.
- Training a foundation model.
- User comments or social features.
- Kafka, Redis, Kubernetes, a separate vector database, or a fleet of microservices.
- Fully automatic factuality guarantees for generated text.

## 6. Primary User Journeys

### 6.1 Discover and verify an event

1. The reader opens the event feed.
2. The reader filters by topic, location, source, or publication period.
3. The reader opens an event.
4. The product shows the title, primary location or unknown state, time range, source count, coverage timeline, and contributing articles.
5. The reader follows an original-source link when more detail is needed.

### 6.2 Reproduce the evaluation

1. The evaluator checks out a tagged version.
2. The evaluator starts the documented local environment.
3. The evaluator loads the versioned dataset and configuration.
4. A documented command produces duplicate, clustering, location, and latency metrics.
5. The report identifies versions, thresholds, limitations, and representative failures.

### 6.3 Review a processing error

1. An administrator opens the review queue or an event detail page.
2. The administrator inspects component similarity scores, location confidence, and source articles.
3. The administrator corrects the location or cluster membership.
4. The system validates the change, records an audit entry, and refreshes affected event aggregates.
5. The correction remains available as evaluation evidence.

## 7. Product Rules

1. A published event contains at least one active source article.
2. An article belongs to at most one active event at a time.
3. Unknown location is valid; guessed coordinates are not.
4. Event time ranges and source counts are derived from active memberships.
5. Duplicate detection must never erase a source URL or provenance record.
6. Original article metadata is immutable except through controlled refetch/version behavior.
7. Administrative corrections require a reason and an audit record.
8. A generated summary must use only the event's stored articles and retain source links.
9. The core system must work with mapping and summarization disabled.

## 8. Twelve-Week Product Plan

| Weeks | Outcome | Exit condition |
| :--- | :--- | :--- |
| 1–2 | Scope, contracts, repository, database, CI, and fixture slice | All applications start; a fixture crosses agreed boundaries |
| 3–4 | Ingestion and normalization | An allowlisted fixture feed reaches PostgreSQL and is inspectable without manual SQL |
| 5–6 | Location and clustering baseline | Seeded articles produce explainable events and a reproducible baseline report |
| 7–8 | Reader MVP | Feed, detail, timeline, provenance, and filters work end to end |
| 9–10 | Quality and correction | Failures are inspectable; one correction flow is audited; targets are measured |
| 11–12 | Release and defense | Clean setup, tagged build, final metrics, limitations, and deterministic demo |

No P2 feature may displace an unmet P0 requirement.

## 9. Product Risks

| Risk | Product response |
| :--- | :--- |
| Wrong location shown to users | Allow an unknown state and expose confidence/evidence to reviewers |
| Distinct events merged | Use multiple signals, record scores, measure false merges, and support correction |
| One event split into several | Reconciliation proposes merge candidates for review |
| Source or language bias | Publish the included source/language set and avoid comprehensiveness claims |
| Feed licensing or storage restrictions | Approve a source and retention policy before live ingestion |
| External-service failure | Cache responses and provide deterministic fixtures |
| Scope creep | Enforce P0/P1/P2 priorities and release gates |
| Summary hallucination | Keep summaries deferred and grounded in event articles with source links |

## 10. Open Product Decisions

The team must close these during Weeks 1–2:

- Final five-to-fifteen feed list and terms-of-use review.
- Three-to-five initial topics.
- Supported language set for the evaluated MVP.
- Article content-retention policy: full text, excerpt, metadata, or hashes.
- Seeded evaluation volume and labelling ownership.
- Hosting budget and demonstration environment.

Implementation-level decisions belong in [TRD.md](TRD.md). Canonical requirements and acceptance criteria belong in [SPEC.md](SPEC.md).
