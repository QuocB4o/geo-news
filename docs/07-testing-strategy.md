# 07 – Testing Strategy

> No tests exist yet. Frameworks are `TBD` until stack decisions are made ([04](04-system-architecture.md#open-decisions)).

## 1. Principles

- The core system must work and be tested with AI summarization disabled.
- Algorithm quality is **measured**, not asserted (PRD success criteria).
- External services (geocoder, models, feeds) are mocked in unit/integration tests.

## 2. Test Levels

| Level | Scope | Owner (per PRD) | Tooling |
| :--- | :--- | :--- | :--- |
| Unit | Normalization, fingerprinting, similarity scoring, services | Each member | `TBD` (stack-dependent) |
| Integration | API ↔ DB, pipeline ↔ DB, auth + bookmarks flow | Member 1 | `TBD` |
| End-to-end | Feed → event page → bookmark in browser | Member 3 | `TBD` |
| Pipeline evaluation | Clustering precision/recall on labeled data | Member 2 | `TBD` |
| Security | Auth, input validation, secret handling | Member 1 | `TBD` |

## 3. Clustering and NLP Evaluation

1. Build a **small manually labeled dataset** of articles grouped into true events (size and sources `TBD`; label guidelines to be written).
2. Include hard cases: two distinct events in the same city on the same day; one evolving event over several days; ambiguous place names; articles with no location.
3. Report precision, recall and F1 on pairwise same-event decisions; report location accuracy and the rate of `unknown`.
4. Tune weights/threshold on a training split; report on a held-out split to avoid overfitting.
5. Re-run evaluation on every change to scoring, models or thresholds.

## 4. Requirement Coverage

| Requirement | Verified by |
| :--- | :--- |
| FR-DUP-1 | Unit tests with exact and near-duplicate fixtures |
| FR-LOC-1/2/3 | Labeled location set; mocked geocoder; unknown-state tests |
| FR-CLU-1/2 | Labeled event dataset; merge/split regression cases |
| FR-SUM-1 / NFR-QUAL-3 | Manual sample review for unsupported claims; test that only cluster text is passed to the model |
| FR-FEED-1, FR-EVT-1, FR-PRV-1 | API integration + E2E |
| FR-SRCH-1 | API tests for filter combinations |
| FR-AUTH-1, FR-BKM-1 | Integration tests incl. unauthorized access |
| FR-MAP-1 | E2E: unknown-location events absent from map |

## 5. Test Data

Fixture articles (anonymized/short excerpts, mindful of source terms of use, `TBD`), recorded feed responses, mocked geocoder responses. No real secrets or personal data.

## 6. CI

No CI exists. Proposed minimum: run lint + unit + integration tests on every pull request (platform `TBD`). Coverage targets: `TBD`.
