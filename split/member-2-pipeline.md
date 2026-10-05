# Member 2 – AI and Data Pipeline

Part of the [work split](README.md). Specs: [technical design](../docs/05-technical-design.md), [testing strategy](../docs/07-testing-strategy.md), [technology decisions](../docs/04-system-architecture.md#technology-decisions).

**You own:** ingestion, normalization, de-duplication, location extraction, embeddings, clustering, re-merge and the evaluation that proves they work.

**You are the critical path.** Almost every step between "articles stored" and "events exist" is yours, and the project's research question is answered by your evaluation numbers. Raise delays early; the [README](README.md#5-load) names which tasks move to Member 1 if needed.

**Off your plate:** the grounded summary is built by Member 1 (you review its grounding in PL-15), schema migrations are written by Member 1 (you review them), and dataset labeling is shared three ways.

## Tasks

| ID | Task | SRS | Phase | Size | Depends on |
| :--- | :--- | :--- | :--- | :--- | :--- |
| PL-01 | Pipeline package, feed configuration, scheduler | FR-ING-1 | 1 | S | BE-01 |
| PL-02 | Feed poller | FR-ING-1 | 1 | M | PL-01, D-01, D-02 |
| PL-03 | Normalization | FR-ING-2 | 1 | M | PL-02, BE-02, D-04 |
| PL-04 | Duplicate detection | FR-DUP-1, NFR-PERF-1 | 2 | M | PL-03 |
| PL-05 | Model spike | NFR-I18N-1 | 2 | M | PL-03, D-01 |
| PL-06 | Entity and location extraction | FR-LOC-1 | 2 | L | PL-05 |
| PL-07 | Geocoding, confidence and `unknown` | FR-LOC-2, FR-LOC-3, NFR-COST-1 | 2 | M | PL-06 |
| PL-08 | Labeled evaluation dataset | NFR-QUAL-1 | 2–3 | L | PL-03, D-08 |
| PL-09 | Embeddings | FR-EMB-1, NFR-PERF-1 | 3 | M | PL-05, BE-02 |
| PL-10 | Clustering | FR-CLU-1, NFR-QUAL-2 | 3 | L | PL-07, PL-09 |
| PL-11 | Re-merge job | FR-CLU-2 | 3 | M | PL-10 |
| PL-12 | Evaluation harness | NFR-QUAL-1, NFR-QUAL-2 | 3 | M | PL-08, PL-10 |
| PL-13 | Topic tagging | – (gap, see D-03) | 3 | S | D-03 |
| PL-14 | Tuning and gate report | NFR-QUAL-1 | 3 | M | PL-11, PL-12 |
| PL-15 | Grounding review of summaries | NFR-QUAL-3 | 4 | S | BE-11 |

## Acceptance Criteria

**PL-01 – Pipeline package, feed configuration, scheduler**
- A `Pipeline/` package exists and runs as a worker container in Compose.
- Feeds are defined in configuration, not code.
- APScheduler triggers the poll on a configurable interval.

**PL-02 – Feed poller**
- Every feed chosen in D-02 is polled; raw items are captured.
- One failing feed is logged and skipped without stopping the others ([05 §7](../docs/05-technical-design.md#7-error-handling-and-caching)).
- Per-feed status (last success, item count, last error) is logged.

**PL-03 – Normalization**
- Each item becomes an article with title, body, language, publish time, source and normalized URL.
- Re-running on the same input creates no new rows.
- What body text is stored respects the outcome of D-04.
- Unit tests use recorded feed responses.

**PL-04 – Duplicate detection**
- Exact and near-exact copies are caught by fingerprint before any semantic comparison.
- Unit tests include exact duplicates, near duplicates and articles that are similar but distinct.

**PL-05 – Model spike**
- Run as described in [07 §3](../docs/07-testing-strategy.md#3-model-spike-phase-2): about 100 articles in the chosen language(s), candidate NER models and embedding models compared, Nominatim resolution rate measured.
- Results and the chosen models replace the provisional names in [04](../docs/04-system-architecture.md#technology-decisions).
- The embedding dimension is given to Member 1 for the schema.

**PL-06 – Entity and location extraction**
- Each article gets its named entities and a primary location for the *event*, not the publisher.
- Articles with no clear location produce none rather than a guess.
- Location accuracy is measured on the labeled set.

**PL-07 – Geocoding, confidence and `unknown`**
- Extracted places are validated through Nominatim at no more than 1 request per second, with an identifying User-Agent.
- Results are cached in the database; a repeated place makes no new request.
- Each result stores coordinates, a confidence score and status `resolved` or `unknown`.
- Ambiguous names and geocoder outages fall to `unknown`.
- The meaning of `confidence` and the rule for `unknown` are written down for Members 1 and 3.

**PL-08 – Labeled evaluation dataset**
- Labeling guidelines and a file format exist before anyone labels.
- The set includes the hard cases in [07 §4](../docs/07-testing-strategy.md#4-clustering-and-nlp-evaluation): two distinct events in one city on one day, one event evolving over days, ambiguous place names, articles with no location.
- Labeling is split evenly across the three members; a sample is labeled by two people to check agreement.
- The set is divided into a tuning split and a held-out split.

**PL-09 – Embeddings**
- Every article has a vector from the model chosen in PL-05, stored with the model name.
- Vectors are cached by article fingerprint; unchanged articles are not re-embedded.

**PL-10 – Clustering**
- Each new article joins the best-scoring recent event or starts a new one, using the combined score in [05 §3](../docs/05-technical-design.md#3-clustering-algorithm).
- Weights and threshold are configuration, not constants in code.
- Candidates are limited to a recent time window.
- An event has a title (starting rule: the earliest article's title), first-seen and last-updated times, and a location derived from its articles.
- A regression test keeps two distinct same-city events separate.

**PL-11 – Re-merge job**
- A scheduled job re-compares recent events and merges those that new evidence shows are the same.
- Merging keeps every article and its source link.
- A regression test covers a false split being repaired.

**PL-12 – Evaluation harness**
- One command reports pairwise precision, recall and F1, location accuracy and the `unknown` rate.
- Tuning uses the tuning split only; reported numbers come from the held-out split.
- The command is re-run on every change to scoring, models or thresholds.

**PL-13 – Topic tagging**
- Every event has one topic from the list agreed in D-03, assigned by the method agreed there.
- Articles outside the agreed topics are handled as D-03 decides (excluded or marked).

**PL-14 – Tuning and gate report**
- Weights and threshold are tuned against the labeled data.
- A short report states the held-out results against the thresholds set in D-08 and recommends go or no-go for the map and summary.
- Known failure cases are listed with examples.

**PL-15 – Grounding review of summaries** *(only if the gate passes)*
- A sample of generated summaries is checked claim by claim against the source articles, with Member 1.
- Any unsupported claim is recorded and fed back into BE-11.
