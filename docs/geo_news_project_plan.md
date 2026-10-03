# Project B: Geo News / Location-Aware Event Explorer
## Capstone Project Plan & Architecture

**Core Concept:** A Southeast Asia-focused news aggregator that reduces information overload by clustering duplicate articles into distinct, location-based "events" featuring timelines and maps.

**Core Research Question:** How can a news system reduce information overload by grouping duplicate coverage into location-aware events while preserving source provenance?

---

### 1. Scope & Constraints
To ensure the project remains feasible for a student team and focuses on algorithmic depth rather than pure data volume:
*   **Target Region:** Vietnam or 4–5 Southeast Asian countries.
*   **Sources:** Deliberately limited to 5–15 reliable RSS/news API feeds.
*   **Topics:** Filtered to 3–5 core topics (e.g., politics, weather, business) to improve clustering accuracy.
*   **Milestones:** Map visualization and AI summarization are secondary goals to be implemented *only* after core location extraction and clustering are proven.

---

### 2. Execution Timeline

| Phase | Focus | Key Deliverables |
| :--- | :--- | :--- |
| **1. Ingestion & Infrastructure** | Data collection and backend setup | RSS poller, data normalization scripts, basic backend API, and data models. |
| **2. NLP & Geocoding** | Entity and location extraction | Exact-duplicate hashing, Named Entity Recognition (NER) for locations, and external Geocoding API integration/caching. |
| **3. Semantic Clustering** | Grouping articles into events | Sentence-transformer embeddings, clustering implementation (incremental threshold or DBSCAN), and evaluation metrics. |
| **4. UI & Contextualization** | User experience and presentation | Event pages, timelines, source provenance lists, map markers, and grounded AI summaries. |

---

### 3. Team Responsibilities (3-Person Division)

| Team Member | Primary Domain | Secondary Contributions |
| :--- | :--- | :--- |
| **Member 1** | **Backend Core (Java/FastAPI):** Product backend, authentication, bookmarks, API endpoints. | Data model design, integration testing. |
| **Member 2** | **AI & Data Pipeline (Python):** RSS ingestion, NLP/NER, embedding generation, semantic clustering, algorithm evaluation. | Model metrics, vector database pipeline. |
| **Member 3** | **Frontend (React/Vue):** UI/UX, map integration (Leaflet/Mapbox), event timeline, search and filters. | E2E testing, source transparency UI. |

---

### 4. Algorithmic Focus (DSA / AI Depth)

The core algorithmic challenge is grouping identical coverage without merging distinct events (e.g., two different protests in the same city). 

**Key Techniques:**
*   **Semantic Matching:** Cosine similarity between article embeddings (via Sentence Transformers).
*   **Clustering:** Incremental threshold-based approach suitable for streaming articles, or DBSCAN/Agglomerative clustering.
*   **Performance Optimization:** Hashing/fingerprints for exact and near-exact duplicates before running expensive semantic comparisons.

**Multi-Variate Scoring Formula:**
Rather than relying entirely on semantic distance, the clustering engine computes a multi-variate score to prevent false merges:

$$final\_similarity = 0.55 \times semantic\_score + 0.20 \times entity\_overlap + 0.15 \times location\_match + 0.10 \times time\_proximity$$

*Evaluation requires testing precision/recall on a manually labeled, small dataset rather than claiming a threshold is arbitrarily "correct."*

---

### 5. Risk Assessment & Mitigations

| Failure Risk | Mitigation Strategy |
| :--- | :--- |
| **Wrong location extracted** | Store confidence scores. Validate places using a Geocoder API. Allow an "unknown" state rather than forcing ambiguous articles onto the map. |
| **False cluster merges** | Require multiple signals (time + semantics + entities). Implement stricter similarity thresholds for ambiguous or generic locations. |
| **False cluster splits** | Periodically run a batch job to compare recent clusters and merge them if new evidence supports it. |
| **AI hallucination in summaries** | Only pass text from clustered, retrieved articles to the summarization model. Internally attribute facts and provide direct links to original sources. |
| **API rate limits & costs** | Cache geocoding results and embeddings aggressively. Restrict initial ingestion to a controlled set of feeds. |