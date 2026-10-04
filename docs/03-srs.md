# 03 – Software Requirements Specification (SRS)

Derived from [02-prd.md](02-prd.md). Requirement IDs are stable references for tests ([07](07-testing-strategy.md)). Items not specified by the source documents are marked `TBD`.

## 1. Purpose and Scope

Defines what the Geo News system must do. Scope: Vietnam / SE Asia news, 5–15 feeds, 3–5 topics.

## 2. Actors

| Actor | Description |
| :--- | :--- |
| Anonymous reader | Browses events (whether login is required to browse: `TBD`) |
| Registered user | Anonymous capabilities plus bookmarks |
| Pipeline (system) | Scheduled ingestion, NLP and clustering jobs |
| Administrator | Manages feeds/config. Role existence: `TBD – Requires project/team decision` |

## 3. Functional Requirements

### 3.1 Ingestion and Processing (Pipeline)

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-ING-1 | Poll configured RSS/news API feeds on a schedule | Core |
| FR-ING-2 | Normalize articles to a common model (title, body, language, publish time, source, URL) | Core |
| FR-DUP-1 | Detect exact and near-exact duplicates via hashing/fingerprints before semantic comparison | Core |
| FR-LOC-1 | Extract the primary event location (city/province/country) and entities via NER | Core |
| FR-LOC-2 | Validate places via a geocoding API and store a confidence score | Core |
| FR-LOC-3 | Support an explicit "unknown" location state | Core |
| FR-EMB-1 | Generate and cache sentence-transformer embeddings per article | Core |
| FR-CLU-1 | Assign articles to events using combined similarity (semantic, entity, location, time) | Core |
| FR-CLU-2 | Periodically re-compare recent clusters and merge when new evidence supports it | Core |
| FR-SUM-1 | Generate an event summary using only text from that event's articles, with links | Secondary |

### 3.2 Product (Backend + Frontend)

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-FEED-1 | Show a feed of clustered events, not raw articles | Core |
| FR-EVT-1 | Event page with coverage timeline and source article list with direct links | Core |
| FR-PRV-1 | Show every source contributing to an event, and the source count | Core |
| FR-SRCH-1 | Search and filter events by topic, country/location and time | Core |
| FR-AUTH-1 | Register, log in and log out | Core |
| FR-BKM-1 | Registered users can bookmark and un-bookmark events and list them | Core |
| FR-MAP-1 | Map markers for events with known location; unknown-location events are not placed on the map | Secondary |
| FR-SRC-1 | Display which sources are included, without claiming comprehensiveness | Core |

## 4. Non-Functional Requirements

Source documents give no numeric targets. Values below are `TBD` and must be set by the team.

| ID | Category | Requirement |
| :--- | :--- | :--- |
| NFR-QUAL-1 | Accuracy | Clustering precision/recall measured on a manually labeled dataset; no unmeasured claims of correctness |
| NFR-QUAL-2 | Accuracy | Distinct events in the same place are not merged by default; ambiguous locations handled via "unknown" |
| NFR-QUAL-3 | Grounding | Summaries contain no claims unsupported by the source articles |
| NFR-PERF-1 | Performance | Fingerprint prefilter precedes semantic comparison; embeddings and geocoding results are cached |
| NFR-PERF-2 | Latency / throughput | `TBD` |
| NFR-SEC-1 | Security | Authenticated bookmarks (JWT); passwords stored hashed (argon2/bcrypt); secrets only via environment |
| NFR-COST-1 | Cost | Stay within external API rate limits by caching and a controlled feed set |
| NFR-MAINT-1 | Maintainability | Layered architecture, clear domain models, interfaces, tests (from feasibility study) |
| NFR-AVAIL-1 | Availability | `TBD` (student project; likely best-effort) |
| NFR-I18N-1 | Language | Vietnamese and/or other SE Asian languages; supported language set and models `TBD` |

## 5. Constraints and Assumptions

- 3-person team; one-semester scope.
- Map and AI summary start only after location extraction and clustering are proven.
- The core system must still work with the AI summary disabled.
- Feed licensing/terms of use for republishing: `TBD – Requires project/team decision`.

## 6. Acceptance Criteria

From the PRD success criteria:

1. Precision/recall reported on a labeled dataset (size `TBD`).
2. Test cases with two distinct same-city events remain separate clusters.
3. Ambiguous-location articles show as "unknown" rather than mis-pinned.
4. Sampled summaries contain no unsupported claims.
