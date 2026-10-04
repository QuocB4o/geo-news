# 02 – Product Requirements Document (PRD)
## Geo News / Location-Aware Event Explorer

**Concept:** A Southeast Asia-focused news aggregator that reduces information overload by clustering duplicate articles into distinct, location-based "events" featuring timelines and maps.

**Core Research Question:** How can a news system reduce information overload by grouping duplicate coverage into location-aware events while preserving source provenance?

---

### 1. Goals
*   Reduce information overload by presenting one *event* instead of many duplicate articles.
*   Make events explorable by location (map) and time (timeline).
*   Preserve source provenance: every event links back to all original articles.
*   Keep the project feasible for a 3-person student team, prioritizing algorithmic depth over data volume.

### 2. Scope & Constraints
*   **Target Region:** Vietnam or 4–5 Southeast Asian countries.
*   **Sources:** Deliberately limited to 5–15 reliable RSS/news API feeds.
*   **Topics:** Filtered to 3–5 core topics (e.g., politics, weather, business) to improve clustering accuracy.
*   **Secondary goals:** Map visualization and AI summarization are implemented *only* after core location extraction and clustering are proven.

### 3. Features
| Feature | Priority | Description |
| :--- | :--- | :--- |
| Event feed | Core | List of clustered events instead of raw articles. |
| Event page | Core | Timeline of coverage and list of source articles with direct links. |
| Source provenance list | Core | Show every source contributing to an event. |
| Search & filters | Core | Filter by topic, country/location, and time. |
| Map view | Secondary | Event markers on a map; "unknown" location events are not forced onto the map. |
| Grounded AI summary | Secondary | Summary of an event built only from its clustered articles, with attribution links. |
| Accounts & bookmarks | Core | Authentication and saving events. |

### 4. Success Criteria
*   Clustering precision/recall measured on a small, manually labeled dataset (no arbitrary "correct" threshold claims).
*   Distinct events in the same place (e.g., two protests in one city) are not merged.
*   Ambiguous-location articles are handled gracefully rather than mis-pinned.
*   Summaries contain no claims unsupported by source articles.

### 5. Timeline
| Phase | Focus | Key Deliverables |
| :--- | :--- | :--- |
| **1. Ingestion & Infrastructure** | Data collection and backend setup | RSS poller, normalization scripts, basic backend API, data models. |
| **2. NLP & Geocoding** | Entity and location extraction | Exact-duplicate hashing, NER for locations, geocoding API integration/caching. |
| **3. Semantic Clustering** | Grouping articles into events | Embeddings, clustering implementation, evaluation metrics. |
| **4. UI & Contextualization** | User experience and presentation | Event pages, timelines, provenance lists, map markers, grounded AI summaries. |

### 6. Team Responsibilities
| Member | Primary Domain | Secondary |
| :--- | :--- | :--- |
| **Member 1** | Backend core: product backend, authentication, bookmarks, API endpoints. | Data model design, integration testing. |
| **Member 2** | AI & data pipeline: ingestion, NLP/NER, embeddings, clustering, evaluation. | Model metrics, vector database pipeline. |
| **Member 3** | Frontend: UI/UX, map, event timeline, search and filters. | E2E testing, source transparency UI. |

### 7. Product Risks
| Risk | Mitigation |
| :--- | :--- |
| Wrong location shown to users | Allow an "unknown" state rather than forcing ambiguous articles onto the map. |
| AI hallucination in summaries | Summaries grounded only in clustered articles, with direct links to sources. |
| Scope creep | Limited sources/topics; map and AI summary deferred until core is proven. |

---
Technical details: [04-system-architecture.md](04-system-architecture.md), [05-technical-design.md](05-technical-design.md). Requirements: [03-srs.md](03-srs.md).
