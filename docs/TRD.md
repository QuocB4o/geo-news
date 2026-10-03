# Technical Requirements Document (TRD)
## Geo News / Location-Aware Event Explorer

See [PRD.md](PRD.md) for goals, scope, and features.

---

### 1. Architecture Overview
*   **Backend Core (Java/FastAPI):** product API, authentication, bookmarks, endpoints.
*   **AI & Data Pipeline (Python):** RSS ingestion, normalization, NLP/NER, geocoding, embedding generation, clustering, evaluation.
*   **Frontend (React/Vue):** event pages, timeline, map (Leaflet/Mapbox), search and filters.
*   **Storage:** relational DB for articles/events/users; vector store/pipeline for embeddings.
*   **External services:** geocoding API (cached), sentence-transformer model, summarization model.

### 2. Processing Pipeline
1.  **Ingest:** poll 5–15 RSS/news API feeds; normalize to a common article model.
2.  **Dedup:** hashing/fingerprints for exact and near-exact duplicates, before any expensive semantic comparison.
3.  **Extract:** NER for locations and entities; validate places via geocoder; store confidence scores.
4.  **Embed:** sentence-transformer embeddings per article (cached).
5.  **Cluster:** assign articles to events using incremental threshold clustering (streaming) or DBSCAN/Agglomerative.
6.  **Serve:** expose events, timelines, provenance, and map data through the API.
7.  **Summarize (secondary):** grounded summary from retrieved cluster articles only.

### 3. Algorithmic Design
The core challenge is grouping identical coverage without merging distinct events (e.g., two different protests in the same city).

**Techniques**
*   Semantic matching: cosine similarity between article embeddings.
*   Clustering: incremental threshold-based approach for streaming, or DBSCAN/Agglomerative.
*   Performance: fingerprint prefilter for exact/near-exact duplicates.

**Multi-variate scoring**

$$final\_similarity = 0.55 \times semantic\_score + 0.20 \times entity\_overlap + 0.15 \times location\_match + 0.10 \times time\_proximity$$

Multiple signals prevent false merges that pure semantic distance would cause.

**Evaluation:** precision/recall on a small manually labeled dataset; weights and thresholds are tuned empirically, not asserted as correct.

### 4. Technical Risks & Mitigations
| Risk | Mitigation |
| :--- | :--- |
| Wrong location extracted | Store confidence scores; validate with geocoder API; allow "unknown" state. |
| False cluster merges | Require multiple signals (time + semantics + entities); stricter thresholds for ambiguous or generic locations. |
| False cluster splits | Periodic batch job compares recent clusters and merges when new evidence supports it. |
| Summary hallucination | Pass only text from clustered, retrieved articles to the model; attribute facts internally; link originals. |
| API rate limits & costs | Cache geocoding results and embeddings aggressively; restrict ingestion to a controlled feed set. |

### 5. Phase Technical Deliverables
| Phase | Deliverables |
| :--- | :--- |
| 1 | RSS poller, normalization scripts, basic backend API, data models. |
| 2 | Exact-duplicate hashing, location NER, geocoding integration/caching. |
| 3 | Embeddings, clustering implementation, evaluation metrics. |
| 4 | API support for event pages, timelines, provenance, map markers, grounded summaries. |
