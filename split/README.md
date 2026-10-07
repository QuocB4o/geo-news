# Work Split – Geo News

How the work in the [Implementation Plan](../docs/IMPLEMENTATION_PLAN.md) is divided across the three team members. Requirements are not repeated here: every task links to [SPEC](../docs/SPEC.md) requirement IDs, and task IDs (`P1-01` … `P5-10`) are the plan's own work packages.

> **Status:** proposal for team review. The plan's roles (Person A, B, C) are mapped to Members 1, 2, 3 below; naming who takes which role is still an open Week 1 decision (D-07). Sizes are rough (S ≈ a few days, M ≈ about a week, L ≈ about two weeks of one person's time), not commitments.

| Member | Plan role | Task list |
| :--- | :--- | :--- |
| Member 1 | Person A – Platform and API Lead | [member-1-backend.md](member-1-backend.md) |
| Member 2 | Person B – Data Intelligence and Evaluation Lead | [member-2-pipeline.md](member-2-pipeline.md) |
| Member 3 | Person C – Product Experience and Quality Lead | [member-3-frontend.md](member-3-frontend.md) |

## 1. How the Split Follows the Plan

- **One owner, one reviewer per task.** Where the plan names a pair ("A + B"), the first-named person is the owner and the other supports. Two packages are split into an API half and a UI half so each has a single owner: `P2-06` (→ `P2-06a`, `P2-06b`) and `P5-02` (→ `P5-02a`, `P5-02b`). Everything else keeps the plan's ID.
- **Reviewers follow the [ownership matrix](../docs/IMPLEMENTATION_PLAN.md#5-ownership-matrix):** API and schema are reviewed by Member 2, pipeline by Member 1, evaluation and UX by the other of Members 2/3 as listed per task. Nobody approves their own schema, security or evaluation change.
- **Committed scope is P0 plus one complete P1 correction.** Accounts, bookmarks, map and summaries (P2) are not tasks here and are not counted in the load. They start only after the Week 10 gate and only if every P0/P1 gate is met.
- **Task rules** (ID, requirement IDs, gate, owner, reviewer, dependencies, status) follow [SPEC §10](../docs/SPEC.md#10-work-breakdown-rules).

## 2. Phases, Gates and Who Does What

| Phase (weeks) | Member 1 | Member 2 | Member 3 | Gate: passes when |
| :--- | :--- | :--- | :--- | :--- |
| **1. Foundation** (1–2) | P1-03, P1-04 | P1-05, P1-08 | P1-01, P1-02, P1-06, P1-07 | **G1:** a new member clones, starts the stack, loads the fixture and sees one event in the browser |
| **2. Ingestion** (3–4) | P2-01, P2-06a | P2-02 – P2-05, P2-07 | P2-06b | **G2:** replaying a fixture feed twice leaves one record per source item; failures are inspectable; no ML starts before this |
| **3. Intelligence** (5–6) | P3-08 | P3-01 – P3-07, P3-09 | P3-10, labelling | **G3:** explainable events and a reproducible baseline report |
| **4. Reader MVP** (7–8) | P4-01 – P4-03, P4-08 | supports with fixtures | P4-04 – P4-07 | **G4:** feed, detail, provenance and filters pass end-to-end tests |
| **5. Review and release** (9–12) | P5-01 – P5-05, P5-08 | P5-07, P5-09 | P5-02b, P5-06, P5-10 | **G5** (end of Week 10): one audited correction and hardening done, scope frozen. **G6** (Week 12): tagged, reproducible, demonstrable |

Gate rules and fallbacks are in [plan §8](../docs/IMPLEMENTATION_PLAN.md#8-milestones-and-decision-gates).

### Critical path

```text
P1-04 schema ┐
P1-05 worker ┴ P1-08 skeleton ─ P2-02 poll ─ P2-03/04/05 ─ P2-07 ─ [G2]
   P3-02 spike ─ P3-04 location ─┐
              └ P3-06 embeddings ┴ P3-07 scoring ─ P3-08 assign ─ P3-09 evaluate ─ [G3]
   P3-01 labelled dataset (all three label) ──────────────────────┘
```

Almost all of it belongs to Member 2. The labelled dataset is as likely as the code to set the date, so labelling begins as soon as articles are stored. A slip in the reader work (P4) does not move G3; a slip in Member 2's chain does.

## 3. Handoffs Between Members

| From | To | Deliverable | Needed by |
| :--- | :--- | :--- | :--- |
| Member 3 (P1-07) | all | Compose stack, CI, `.env.example` | End of Phase 1 |
| Member 1 (P1-03) | Member 3 | Error envelope and health/version endpoints; draft OpenAPI | Before P1-06 is finished |
| Member 1 (P1-04) | Member 2 | First migration, reviewed by Member 2 | Before P1-08 |
| Member 2 (P3-02) | Member 1 | Chosen embedding model and dimension, set in a migration | Before P3-06 |
| Member 2 (P3-04) | Members 1, 3 | Meaning of `resolved` / `unknown` / `ambiguous` and of confidence | Before P4-01, P4-05 |
| Member 2 (P3-07) | Member 1 | Cluster-decision records to project into events | Before P3-08 |
| Member 1 (P3-08, P4-01 – P4-03) | Member 3 | Stable event projections and frozen API schemas | Start of Phase 4 |
| Member 2 | Members 1, 3 | Deterministic fixtures covering every UI/API state | Before P4-04 |
| Member 1 (P5-01) | Members 2, 3 | Review-queue items and API | Before P5-02b |

A contract or schema change after delivery needs the receiving member's review.

## 4. Requirement Coverage

One accountable member per requirement; "Supports" lists other tasks needed end to end. P2 items are deferred and unassigned.

| Requirement | Accountable | Task | Supports |
| :--- | :--- | :--- | :--- |
| FR-ING-01 | Member 2 | P2-02 | P2-01, P1-08 |
| FR-ING-02 | Member 2 | P2-03 | |
| FR-ING-03 | Member 2 | P2-04 | |
| FR-ING-04 | Member 2 | P2-05 | |
| FR-ING-05 | Member 2 | P2-05 | P2-06a, P2-06b |
| FR-ENR-01 | Member 2 | P3-03 | |
| FR-ENR-02 | Member 2 | P3-03 | |
| FR-ENR-03 | Member 2 | P3-04 | P3-02 |
| FR-ENR-04 | Member 2 | P3-05 | |
| FR-ENR-05 | Member 2 | P3-06 | P3-02 |
| FR-CLU-01 | Member 2 | P3-07 | |
| FR-CLU-02 | Member 2 | P3-07 | P3-10 |
| FR-CLU-03 | Member 1 | P3-08 | P3-07 |
| FR-CLU-04 | Member 1 | P5-01 | Member 2 (reconciliation job) |
| FR-CLU-05 | Member 1 | P3-08, P5-03 | |
| FR-EVT-01 | Member 3 | P4-04 | P4-01 |
| FR-EVT-02 | Member 3 | P4-04 | P4-02 |
| FR-EVT-03 | Member 1 | P4-03 | P4-04 |
| FR-EVT-04 | Member 3 | P4-05 | P3-04 |
| FR-EVT-05 | Member 3 | P4-04 | P4-02 |
| FR-ADM-01 | Member 1 | P5-01 | P3-10 |
| FR-ADM-02 | Member 1 | P5-02a, P5-03 | P5-02b |
| FR-ADM-03 | Member 1 | P5-02a | P5-02b |
| FR-EVA-01 | Member 2 | P3-01 | all (labelling) |
| FR-EVA-02 | Member 2 | P3-09, P5-07 | |
| FR-EVA-03 | Member 2 | P3-09 | P5-07 |
| FR-USR-01, FR-USR-02, FR-MAP-01, FR-SUM-01 | – | deferred (P2) | proposed on unlock: Member 1, Member 1, Member 3, Member 2 |
| NFR-01 | Member 1 | P5-04 | P2-07 |
| NFR-02 | Member 2 | P2-04 | P5-04 |
| NFR-03 | Member 1 | P4-08 | P5-06 |
| NFR-04 | Member 1 | P5-05 | P2-01, P2-07 |
| NFR-05 | Member 3 | P4-05 | P5-07 |
| NFR-06 | Member 3 | P4-06 | P5-06 |
| NFR-07 | Member 3 | P1-07 | P1-03, P1-04 |
| NFR-08 | Member 1 | P5-08 | P1-07, P4-07, P5-10 |
| NFR-09 | Member 1 | P1-03 | P1-05, P5-04 |
| NFR-10 | Member 2 | P3-05, P5-09 | |

## 5. Load

Weights: S = 1, M = 2, L = 3. Counts are tasks in the committed scope only.

| Member | Tasks | S / M / L | Weight |
| :--- | :--- | :--- | :--- |
| Member 1 | 15 | 4 / 11 / 0 | 26 |
| Member 2 | 17 | 2 / 12 / 3 | 35 |
| Member 3 | 13 | 4 / 8 / 1 | 23 |

Member 2's weight (35) is about 25% above the average (28) and sits on the critical path. The plan's ownership is kept as assigned; if Member 2 falls behind, move these first, in this order:

1. P2-07 (ingestion integration tests) → Member 1.
2. P3-05 (geocoder adapter) → Member 1.
3. Labelling coordination within P3-01 → Member 3 (already light in Phases 2–3).
4. P5-09 (demo dataset) → Member 3.

Member 1 has spare capacity in Phase 3 beyond P3-08; use it for pipeline reviews, labelling, and starting P4-01 against fixtures. Review the balance at every gate.

## 6. Open Decisions

From [PRD §10](../docs/PRD.md#10-open-product-decisions) and [plan §14.1](../docs/IMPLEMENTATION_PLAN.md#141-decisions-due-by-end-of-week-1). Team members decide; the driver brings a recommendation.

| # | Decision | Driver | Decide by | Blocks |
| :--- | :--- | :--- | :--- | :--- |
| D-01 | Final feed list (5–15) and terms-of-use review | Member 2 | Week 1 | P2-02 |
| D-02 | Three to five topics and how an event gets its topic | Member 2 with Member 3 | Week 2 | P1-08 fixtures, P4-03 |
| D-03 | Language set for the evaluated MVP | Member 2 | Week 2 | P3-02 |
| D-04 | Content-retention policy: full text, excerpt, metadata or hashes | Member 3 | Week 1 | P2-03, fixtures, P4-04 |
| D-05 | Evaluation dataset size and labelling ownership | Member 2 | Week 2 | P3-01 |
| D-06 | Hosting budget and demonstration environment | Member 3 | Week 2 | P5-08 |
| D-07 | Who takes Person A, B, C; alignment with the course rubric and with P2 deferral | Team | Week 1 | everything |
| D-08 | Seeded dataset volume and the repeatable performance command | Member 1 | End of Week 2 | P4-08 |
| D-09 | How administrator access is protected in P0/P1 before P2 accounts exist | Member 1 | Before P2-06a | P2-06a, P5-01, P5-02a |

Suggestion for D-09: a single admin credential or token from the environment, recorded as the audit actor, and an ADR noting it is replaced if accounts (P2) are built.

## 7. Issues Found in the Docs

Found while preparing this split. Not fixed here.

1. **No administrator identity in P0/P1.** [SPEC](../docs/SPEC.md) lists `/admin/sources` as P0/P1 and the audit record needs an actor, but authentication and accounts are P2 (`FR-USR-01`). How admin endpoints are protected is not specified → D-09.
2. **Seeded volume undefined.** [TRD §10](../docs/TRD.md#10-performance-baseline) says the SPEC must define it before optimization, but the SPEC does not → D-08.
3. **Inspection endpoint missing from the API baseline.** Plan package P2-06 needs an article/processing inspection endpoint that is not in [SPEC §5](../docs/SPEC.md#5-api-acceptance-baseline); P2-06a adds it to `openapi.yaml`.
4. **Topic assignment unspecified.** Events have a topic and a topic filter (`FR-EVT-03`), but no requirement says how a topic is assigned → D-02.
5. **Event title unspecified.** No requirement says how an event title is derived; TRD only says projections include it. Propose the earliest article's title as the starting rule in P3-08.
6. **Placeholders versus layout.** The repo's empty `Backend/`, `Database/`, `Frontend/`, `ExternalServices/` do not match the [TRD §4](../docs/TRD.md#4-proposed-repository-layout) layout; P1-02 replaces them.
