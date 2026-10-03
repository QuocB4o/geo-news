# geo-news

**Geo News / Location-Aware Event Explorer** — a Southeast Asia-focused news aggregator that reduces information overload by clustering duplicate articles into distinct, location-based "events" with timelines and maps.

> **Research question:** How can a news system reduce information overload by grouping duplicate coverage into location-aware events while preserving source provenance?

> **Status:** Planning stage. The repository currently contains requirements documents only; no code has been written yet.

## Features

| Feature | Priority |
| :--- | :--- |
| Event feed (clustered events instead of raw articles) | Core |
| Event page with coverage timeline and source articles | Core |
| Source provenance list | Core |
| Search and filters (topic, location, time) | Core |
| Accounts and bookmarks | Core |
| Map view (events with unknown location are not forced onto the map) | Secondary |
| Grounded AI summary (built only from the event's own articles, with links) | Secondary |

Map and AI summarization are built only after location extraction and clustering are proven.

## Scope

- **Region:** Vietnam, or 4–5 Southeast Asian countries
- **Sources:** 5–15 reliable RSS/news API feeds
- **Topics:** 3–5 core topics (e.g. politics, weather, business)

## How it works

1. **Ingest** RSS/news feeds and normalize them into a common article model.
2. **Dedup** exact and near-exact duplicates with hashing/fingerprints.
3. **Extract** locations and entities with NER, validate places via a geocoding API, and store confidence scores.
4. **Embed** articles with sentence transformers.
5. **Cluster** articles into events (incremental threshold clustering, or DBSCAN/Agglomerative).
6. **Serve** events, timelines, provenance, and map data through the API.
7. **Summarize** (secondary) using only text from the clustered articles.

To avoid merging distinct events (e.g. two protests in the same city), clustering combines several signals rather than semantic distance alone:

```
final_similarity = 0.55 * semantic_score
                 + 0.20 * entity_overlap
                 + 0.15 * location_match
                 + 0.10 * time_proximity
```

Weights and thresholds are tuned against a small, manually labeled dataset using precision/recall.

## Planned architecture

| Component | Stack | Responsibilities |
| :--- | :--- | :--- |
| Backend core | Java or FastAPI | Product API, authentication, bookmarks, endpoints |
| AI and data pipeline | Python | Ingestion, NLP/NER, geocoding, embeddings, clustering, evaluation |
| Frontend | React or Vue, Leaflet/Mapbox | Event pages, timeline, map, search and filters |
| Storage | Relational DB plus vector store | Articles, events, users, embeddings |

## Roadmap

1. **Ingestion and infrastructure** — RSS poller, normalization, basic API, data models
2. **NLP and geocoding** — duplicate hashing, location NER, cached geocoding
3. **Semantic clustering** — embeddings, clustering, evaluation metrics
4. **UI and contextualization** — event pages, timelines, provenance, map markers, grounded summaries

## Team

| Member | Domain |
| :--- | :--- |
| Member 1 | Backend core (API, auth, bookmarks, data models) |
| Member 2 | AI and data pipeline (ingestion, NLP, clustering, evaluation) |
| Member 3 | Frontend (UI/UX, map, timeline, search and filters) |

## Documentation

- [PRD](docs/PRD.md) — goals, scope, features, success criteria, timeline, product risks
- [TRD](docs/TRD.md) — architecture, pipeline, algorithms, technical risks
