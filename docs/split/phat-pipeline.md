# Phat – Data Intelligence and Evaluation (proposed Person B)

Part of the [work split](README.md). Authority: [PRD](../PRD.md), [TRD](../TRD.md), [SPEC](../SPEC.md), [Implementation Plan](../IMPLEMENTATION_PLAN.md#42-person-b--data-intelligence-and-evaluation-lead). Package IDs (`P#-##`) are the plan's.

**You own:** feed ingestion, normalization and processing state, duplicate detection, entity/location extraction and the geocoder adapter, embeddings, candidate retrieval, clustering, label guidelines, the evaluation command and its reports.

**You are the critical path and carry the most work.** The research question is answered by your evaluation numbers. Raise delays early; the [README](README.md#5-load) lists what moves to other members first.

**Your schema reviews matter:** Bao writes migrations, but you approve every change that touches pipeline tables.

**Backup role:** you cover for Bao (platform and API).

## Tasks

| ID | Task | Requirements | Gate | Size | Reviewer | Depends on | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| P1-05 | Pipeline worker scaffold: stage interface, configuration, structured job logging | NFR-01, NFR-02, NFR-09 | G1 | M | Bao | – | In progress (scaffold in repo) |
| P1-08 | Fixture feed and a temporary deterministic assignment that reaches one event card | FR-ING-01–05, FR-EVT-01–02 | G1 | M | Bao | P1-03 – P1-06 | Not started |
| P2-02 | Feed polling with timeouts, redirect/content limits and feed-run records | FR-ING-01, FR-ING-05, NFR-01 | G2 | M | Bao | P2-01, D-01 | Not started |
| P2-03 | Deterministic Unicode, text, time and language normalization | FR-ING-02 | G2 | S | Bao | P2-02, D-04 | Not started |
| P2-04 | Source identity, normalized-URL identity and replay-safe insertion | FR-ING-03, NFR-02 | G2 | M | Bao | P2-03 | Not started |
| P2-05 | Provenance preservation and error-state persistence | FR-ING-04, FR-ING-05 | G2 | S | Bao | P2-04 | Not started |
| P2-07 | Integration tests: replay, malformed items, unsupported languages, outage, unsafe URLs | NFR-01, NFR-02, NFR-04 | G2 | M | Bao | P2-02 – P2-05 | Not started |
| P3-01 | Labelling guide, dataset schema, disagreement/adjudication process | FR-EVA-01 | G3 | M | Huy | D-05 | Not started |
| P3-02 | NER, embedding and geocoder spike on Vietnamese/English articles | FR-ENR-03–05, FR-EVA-02 | G3 | L | Bao | P2-03, D-03 | Not started |
| P3-03 | Exact/near duplicate detection that preserves cross-source articles | FR-ENR-01, FR-ENR-02 | G3 | M | Bao | P2-05 | Not started |
| P3-04 | Versioned entity/location extraction with resolved / unknown / ambiguous outcomes | FR-ENR-03, FR-EVT-04 | G3 | L | Bao | P3-02 | Not started |
| P3-05 | Cached, replaceable geocoder adapter | FR-ENR-04, NFR-10 | G3 | M | Bao | P3-02 | Not started |
| P3-06 | Versioned embedding generation and compatibility checks | FR-ENR-05 | G3 | M | Bao | P3-02 | Not started |
| P3-07 | Bounded candidate retrieval and multi-signal scoring | FR-CLU-01, FR-CLU-02 | G3 | L | Bao | P3-04, P3-06 | Not started |
| P3-09 | Reproducible evaluation command and baseline report | FR-EVA-02, FR-EVA-03 | G3 | M | Huy | P3-01, P3-07, P3-08 | Not started |
| P5-07 | Final held-out evaluation and limitation report | FR-EVA-02, FR-EVA-03, NFR-05 | G6 | M | Huy | P5-04 | Not started |
| P5-09 | Deterministic demo dataset, cached providers and recorded fallback | NFR-10 | G6 | M | Huy | P5-07 | Not started |

Supporting (not owned): you reuse P2-01 for fetch validation, provide the two-source duplicate and same-city fixtures that API and web tests rely on, and supply the review-queue items for P5-01.

## Acceptance Criteria

**P1-05 – Pipeline scaffold**
- The worker starts from Compose, runs a stage interface with `pending` / `running` / `succeeded` / `retryable_failed` / `permanent_failed` states, and logs structured events with a job ID.
- Stage claiming is transactional so two workers cannot process the same article, stage and version.

**P1-08 – Walking-skeleton fixture**
- A fixture feed is loaded by the worker, stored with processing state and provenance, assigned to one event by a clearly temporary rule, and the event is visible through the API and in the browser without manual SQL (gate G1).

**P2-02 – Feed polling**
- Enabled sources are polled on their configured interval with connect/read timeouts, a size limit, accepted content types, a redirect cap with re-validation, and safe XML parsing.
- Each poll writes a `feed_run` record; one failing feed or item does not stop others.

**P2-03 – Normalization**
- Unicode and whitespace are normalized, times are UTC, language is detected, fingerprints are created, and only fields allowed by D-04 are kept. A fixture feed gives complete records or an explicit validation outcome.

**P2-04 – Identity and replay**
- Source/external ID and normalized-URL hash are the identities; replaying the same fixture feed twice leaves one record per source item.

**P2-05 – Provenance and errors**
- Every article keeps its source record and original URL; unsupported, malformed or inaccessible items keep stage, error code, reason, attempt count and timestamps.

**P2-07 – Ingestion integration tests**
- Tests cover replay, malformed items, unsupported language, feed outage and unsafe URLs against a real PostgreSQL. Gate G2 passes only when they do.

**P3-01 – Labelling guide and dataset**
- The guide and format cover duplicates, hard negatives, evolving stories, ambiguous/no-location articles and unrelated same-place events; disagreements and adjudications are recorded; the dataset has a version and licence/retention notes.
- Labelling is shared by all three members; you set the guidelines and check consistency.

**P3-02 – Model spike**
- NER, embedding and geocoder options are compared on representative Vietnamese and English articles, kept separate from the held-out set; chosen models, versions and the embedding dimension are written down in a short ADR and handed to Bao.

**P3-03 – Duplicate detection**
- Checks run cheapest first: source ID, URL hash, title hash in a window, content fingerprint, then semantic comparison only if inconclusive.
- Two sources carrying identical content stay two articles with both links; expensive processing is reused.

**P3-04 – Entities and location**
- Every processed article has entity records and a `resolved`, `unknown` or `ambiguous` location with confidence and evidence; publisher location and incidental references are not taken as the event location; provider/model versions are recorded.

**P3-05 – Geocoder adapter**
- Responses are cached by normalized query and provider version; calls are rate-limited and send an identifying User-Agent; tests run on recorded responses and assert call counts.

**P3-06 – Embeddings**
- Each eligible article has a vector with model version, dimension, content hash and completion time; exact duplicates reuse it; incompatible versions are never compared.

**P3-07 – Candidates and scoring**
- Candidates come from a bounded recent window with only safe topic/location filters; every considered candidate stores semantic, entity, location and time scores, combined score, threshold and configuration version ([TRD §6.5](../TRD.md#65-embeddings-and-clustering)).

**P3-09 – Evaluation command**
- One documented command reports git revision, dataset/model/configuration versions, weights, thresholds, duplicate, pairwise and B-cubed clustering metrics, false merges/splits with examples, location accuracy and coverage, latency and the raw-to-event reduction.
- The baseline report is reproducible; gate G3 passes when the fixture dataset yields the cases listed in [plan Phase 3](../IMPLEMENTATION_PLAN.md#7-phase-plan).

**P5-07 – Final report**
- The held-out evaluation is run once on the release configuration with limitations and target misses stated.

**P5-09 – Demo dataset**
- The demo runs end to end on seeded data with cached geocoder/model responses and no live services; a recorded fallback exists.
