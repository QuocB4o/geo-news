# Work Split – Geo News

How the work in [`docs/`](../docs/01-project-overview.md) is divided across the three team members. Specs are not repeated here; every task links back to a requirement ID in the [SRS](../docs/03-srs.md).

> **Status:** proposal for team review. Sizes are rough estimates (S ≈ a few days, M ≈ about a week, L ≈ about two weeks of one person's project time), not commitments. No calendar dates are set because the semester schedule is not in the docs.

| Member | Domain | Task list |
| :--- | :--- | :--- |
| Member 1 | Backend, database, infrastructure | [member-1-backend.md](member-1-backend.md) (`BE-*`) |
| Member 2 | AI and data pipeline | [member-2-pipeline.md](member-2-pipeline.md) (`PL-*`) |
| Member 3 | Frontend and UX | [member-3-frontend.md](member-3-frontend.md) (`FE-*`) |

## 1. Planning Decisions

These go beyond the role table in the [PRD](../docs/02-prd.md#6-team-responsibilities) and are the parts the team should explicitly agree to.

| # | Decision | Why |
| :--- | :--- | :--- |
| 1 | **Backend and frontend run in parallel with the pipeline**, not after it. The PRD's four phases describe the pipeline's critical path only. | Otherwise Member 3 has nothing to build until Phase 4 and all UI risk lands at the end. |
| 2 | **Member 1 publishes the API contract in Phase 1** ([BE-03](member-1-backend.md)); Member 3 builds against mocks of it. | Removes the frontend's dependency on real clustered data. |
| 3 | **Member 1 owns everything nobody owned**: dev environment, Docker Compose, schema migrations, CI, deployment. | The docs assign none of these. One shared database needs one owner. |
| 4 | **Member 1 is the only author of schema migrations; Member 2 is a required reviewer.** | The pipeline writes and the backend reads the same tables. |
| 5 | **Grounded summary (FR-SUM-1) moves from Member 2 to Member 1** ([BE-11](member-1-backend.md)); Member 2 reviews grounding. | Member 2 carries the critical path. The summary is a secondary, API-integration task. |
| 6 | **Labeling the evaluation dataset is shared by all three**; Member 2 owns the guidelines and format ([PL-08](member-2-pipeline.md)). | Largest single non-coding cost; also gives everyone a feel for the hard cases. |
| 7 | **A gate at the end of Phase 3** decides whether the map and summary are built ([PL-14](member-2-pipeline.md)). | The PRD and SRS both say secondary features start only after location extraction and clustering are proven. |

## 2. Phases and Milestones

| Phase (PRD) | Member 1 | Member 2 | Member 3 | Milestone: done when |
| :--- | :--- | :--- | :--- | :--- |
| **1. Ingestion & infrastructure** | BE-01 – BE-04 | PL-01 – PL-03 | FE-01 – FE-03 | One command starts the stack; real articles are stored; API contract is agreed; frontend runs on mocks |
| **2. NLP & geocoding** | BE-05, BE-07, BE-08 | PL-04 – PL-08 | FE-04 – FE-06 | Articles are de-duplicated and located (or `unknown`); spike results recorded in [04](../docs/04-system-architecture.md#technology-decisions); feed and event page work on mocks |
| **3. Semantic clustering** | BE-06, BE-09, BE-13 | PL-09 – PL-14 | FE-07 – FE-10 | Real events exist; precision/recall reported on held-out data; core UI runs on the real API; **gate decision made** |
| **4. UI & contextualization** | BE-10 – BE-12 | PL-15, tuning | FE-11 – FE-13 | End-to-end demo: feed → event page → bookmark; map and summary only if the gate passed |

### Critical path

```text
BE-01 env ─ BE-02 schema ─┐
PL-01 package ─ PL-02 poll ┴ PL-03 normalize ─ PL-05 spike ─ PL-06/07 location ─┐
                                    │           PL-09 embed ────────────────────┴ PL-10 cluster ─┐
                                    └ PL-08 labeled dataset (all three label) ─────────────────┴ PL-12 evaluate ─ PL-14 gate
```

Everything here except BE-01 and BE-02 belongs to Member 2. The labeled dataset (PL-08) is as likely as the code to set the date, so labeling starts as soon as articles are stored. A slip here delays the whole project; a slip in backend or frontend tasks does not, because of the mock contract.

### Phase 3 gate

Before any evaluation run, the team writes down the thresholds it will accept (decision D-08). The gate passes when the measured results meet them for:

- pairwise precision/recall on the held-out split ([SRS](../docs/03-srs.md#6-acceptance-criteria) criterion 1),
- the same-city, distinct-event test cases staying separate (criterion 2),
- ambiguous locations resolving to `unknown` rather than a wrong pin (criterion 3).

If the gate fails, Phase 4 effort goes to clustering and location quality, and the map and summary are dropped from scope.

## 3. Handoffs Between Members

| From | To | Deliverable | Needed by |
| :--- | :--- | :--- | :--- |
| Member 1 (BE-01) | all | Docker Compose with PostgreSQL + pgvector, `.env.example` | Start of Phase 1 |
| Member 1 (BE-02) | Member 2 | Tables for source, article, place, event, embedding | Before PL-03 |
| Member 1 (BE-03) | Member 3 | OpenAPI contract with example payloads | Before FE-02 |
| Member 2 (PL-05) | Member 1 | Embedding model and vector dimension | Before the embedding column is finalized |
| Member 2 (PL-07) | Members 1, 3 | Meaning of `resolved` / `unknown` and of `confidence` | Before BE-05, FE-05 |
| Member 2 (PL-10) | Members 1, 3 | Real events in the database | Before FE-10 |
| Member 2 (PL-14) | all | Gate report | End of Phase 3 |
| Member 1 (BE-11) | Member 3 | `summary` field populated, with attribution links | Before FE-12 |

Changing a handoff after it is delivered needs the receiving member's review.

## 4. Requirement Coverage

Each requirement has exactly one accountable member. "Supports" lists the other tasks needed for it to work end to end.

| Requirement | Accountable | Task | Supports |
| :--- | :--- | :--- | :--- |
| FR-ING-1 | Member 2 | PL-02 | BE-01 |
| FR-ING-2 | Member 2 | PL-03 | BE-02 |
| FR-DUP-1 | Member 2 | PL-04 | BE-02 |
| FR-LOC-1 | Member 2 | PL-06 | PL-05 |
| FR-LOC-2 | Member 2 | PL-07 | |
| FR-LOC-3 | Member 2 | PL-07 | BE-05, FE-05 |
| FR-EMB-1 | Member 2 | PL-09 | BE-02 |
| FR-CLU-1 | Member 2 | PL-10 | PL-12 |
| FR-CLU-2 | Member 2 | PL-11 | |
| FR-SUM-1 | Member 1 | BE-11 | PL-15, FE-12 |
| FR-FEED-1 | Member 3 | FE-04 | BE-05 |
| FR-EVT-1 | Member 3 | FE-05 | BE-05 |
| FR-PRV-1 | Member 3 | FE-05 | BE-05 |
| FR-SRCH-1 | Member 3 | FE-07 | BE-06, PL-13 |
| FR-AUTH-1 | Member 1 | BE-07 | FE-08 |
| FR-BKM-1 | Member 1 | BE-08 | FE-09 |
| FR-MAP-1 | Member 3 | FE-11 | BE-10 |
| FR-SRC-1 | Member 3 | FE-06 | BE-05 |
| NFR-QUAL-1 | Member 2 | PL-08, PL-12 | all (labeling) |
| NFR-QUAL-2 | Member 2 | PL-10, PL-12 | |
| NFR-QUAL-3 | Member 1 | BE-11 | PL-15 |
| NFR-PERF-1 | Member 2 | PL-04, PL-07, PL-09 | |
| NFR-PERF-2 | Member 1 | BE-13 | |
| NFR-SEC-1 | Member 1 | BE-07, BE-13 | FE-08 |
| NFR-COST-1 | Member 2 | PL-07 | |
| NFR-MAINT-1 | Member 1 | BE-04 | each member, own code |
| NFR-AVAIL-1 | Member 1 | BE-12 | |
| NFR-I18N-1 | Member 2 | PL-05 | |

## 5. Load

| Member | Tasks | S / M / L | Rough weight (S=1, M=2, L=3) |
| :--- | :--- | :--- | :--- |
| Member 1 | 13 | 5 / 7 / 1 | 22 |
| Member 2 | 15 | 3 / 9 / 3 | 30 |
| Member 3 | 13 | 5 / 7 / 1 | 22 |

Member 2's weight includes all of PL-08 although its labeling is shared three ways, so the real gap is somewhat smaller. Even so, Member 2 is still about a third heavier and sits on the critical path, after decisions 5 and 6. Review the balance at each milestone. The first tasks to move if Member 2 falls behind are the evaluation harness (PL-12) and topic tagging (PL-13), both to Member 1.

## 6. Open Decisions

These block tasks. Each has one member who drives it to a team decision.

| # | Decision | Driver | Decide by | Blocks |
| :--- | :--- | :--- | :--- | :--- |
| D-01 | Region and language set (Vietnam only vs. 4–5 countries) | Member 2 | Start of Phase 1 | PL-02, PL-05 |
| D-02 | Feed list (5–15 sources) | Member 2 | Start of Phase 1 | PL-02 |
| D-03 | Topic list (3–5) and how an event gets its topic | Member 2, with Member 3 | End of Phase 2 | PL-13, BE-06, FE-07 |
| D-04 | Feed licensing and terms of use (what text may be stored and shown) | Member 3 | Early Phase 1, before PL-03 | PL-03, FE-05, test fixtures |
| D-05 | Hosting provider and budget | Member 1 | Start of Phase 4 | BE-12 |
| D-06 | Whether an administrator role exists | Member 1 | Start of Phase 1 | BE-02 |
| D-07 | Numeric targets for latency and availability; test coverage target | Member 1 | During Phase 3 | BE-13 |
| D-08 | Labeled dataset size and the gate thresholds | Member 2 | Start of Phase 2 | PL-08, PL-12, PL-14 |
| D-09 | Logout behaviour (see doc issue 2 below) | Member 1 | With BE-03 | BE-07, FE-08 |
| D-10 | Target users / personas | Member 3 | Early Phase 1, before FE-03 is reviewed | FE-03 |

Suggestion for D-06: no administrator role; feeds are managed through configuration. This keeps scope down and nothing in the feature list needs an admin UI.

## 7. Issues Found in the Docs

Found while preparing this split. Not fixed here.

1. [`01-project-overview.md`](../docs/01-project-overview.md) still lists the stack as open (Java or FastAPI, React or Vue, and so on). [04](../docs/04-system-architecture.md#technology-decisions) has since decided it.
2. The SRS requires logout (FR-AUTH-1), but `/auth/logout` was removed from the [API](../docs/06-database-api-design.md) when auth became JWT. This split assumes logout means the client discards its token (FE-08); D-09 confirms it.
3. `event.topic` and the topic filter exist in the schema and API, but no requirement says how a topic is assigned. PL-13 and D-03 cover it.
4. No requirement says how an event's title is produced. PL-10 proposes the earliest article's title as a starting rule.
5. The `Pipeline/` directory in the [proposed layout](../docs/05-technical-design.md#1-source-layout-proposed) does not exist yet; PL-01 creates it.
