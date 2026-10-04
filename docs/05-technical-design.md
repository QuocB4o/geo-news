# 05 – Technical Design

Design of the processing pipeline and algorithms (from the TRD and feasibility study). Stack choices are in [04](04-system-architecture.md#technology-decisions).

## 1. Source Layout (proposed)

The repo currently holds empty directories `Backend/`, `Database/`, `Frontend/`, `ExternalServices/`. Proposed structure:

```text
geo-news/
├── Backend/            # FastAPI: auth, bookmarks, event queries
├── Pipeline/           # Python ingestion, NLP, clustering, evaluation (to be created)
├── Frontend/           # web client
├── Database/           # migrations, seed data
├── ExternalServices/   # adapters/config for geocoder, models (TBD)
└── docs/
```

## 2. Pipeline Stages

| # | Stage | Input → Output | Notes |
| :--- | :--- | :--- | :--- |
| 1 | Ingest | feed URL → raw items | Scheduled poll of 5–15 feeds |
| 2 | Normalize | raw → Article | Clean title/body, language, publish time, source |
| 3 | Dedup | Article → fingerprint match? | Hash/fingerprint for exact and near-exact |
| 4 | Extract | Article → entities, place + confidence | NER; geocoder validation; cached |
| 5 | Embed | Article → vector | `sentence-transformers` multilingual; cached |
| 6 | Cluster | Article + candidates → Event | Incremental threshold, or DBSCAN/Agglomerative |
| 7 | Re-merge | recent Events → merged Events | Periodic batch to fix false splits |
| 8 | Summarize *(secondary)* | Event articles → summary + links | Grounded only |

Stages should be idempotent and re-runnable; failures on one article must not block the batch (retry policy `TBD`).

## 3. Clustering Algorithm

```
final_similarity = 0.55 * semantic_score
                 + 0.20 * entity_overlap
                 + 0.15 * location_match
                 + 0.10 * time_proximity
```

- `semantic_score`: cosine similarity of embeddings.
- `entity_overlap`: overlap of named entities (metric, e.g. Jaccard, `TBD`).
- `location_match`: agreement of geocoded place; weaker for generic/ambiguous places.
- `time_proximity`: decays with time gap between article and event.
- Assignment: attach an article to the best-scoring recent event if `final_similarity ≥ threshold`, otherwise start a new event.
- Weights and threshold are **starting values**, tuned against a labeled dataset by precision/recall, not asserted as correct.
- Candidate retrieval (nearest neighbours restricted to a recent time window) keeps comparison cost bounded. Use pgvector's index (HNSW or IVFFlat) with a time-window filter.

## 4. Location Handling

- Extract the location of the *event*, not the publisher's base.
- Store `place_name`, coordinates, `confidence` and `status` (`resolved` | `unknown`).
- Ambiguous names (e.g. "Washington") need disambiguation or fall to `unknown`.
- Unknown events appear in feed/search but not on the map.

## 5. Grounded Summarization (secondary)

Pass only retrieved text of the event's own articles to the model; attribute facts internally; return links to originals; mark uncertainty. Model `TBD`. The system must work with this feature disabled.

## 6. Backend Design Principles

From the feasibility study: layered architecture (controller → service → repository), interface-based dependencies for external services, domain entities `Article`, `Source`, `Event`, `User`, `Bookmark`. Patterns beyond this: `TBD`.

## 7. Error Handling and Caching

| Concern | Approach |
| :--- | :--- |
| Geocoder rate limits / outage | Cache results; degrade to `unknown` |
| Feed failure | Skip and retry next cycle; log per-feed status |
| Duplicate ingestion | Unique key on normalized URL / fingerprint |
| Embedding cost | Cache by article fingerprint |

## 8. Known Technical Risks

| Risk | Mitigation |
| :--- | :--- |
| Wrong location | Confidence, geocoder validation, `unknown` |
| False merges | Multi-signal scoring, stricter thresholds for generic places |
| False splits | Periodic re-merge job |
| Summary hallucination | Grounded retrieval and links |
| API limits / cost | Aggressive caching, controlled feed set |
| Source bias | Display included sources; do not claim comprehensiveness |

## 9. Technical Debt (current)

No code exists; the debt is documentation-level: provisional model/geocoder choices ([04](04-system-architecture.md#technology-decisions)), no labeled dataset, empty top-level directories.
