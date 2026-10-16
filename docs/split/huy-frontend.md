# Huy – Product Experience and Quality (proposed Person C)

Part of the [work split](README.md). Authority: [PRD](../PRD.md), [TRD](../TRD.md), [SPEC](../SPEC.md), [Implementation Plan](../IMPLEMENTATION_PLAN.md#43-person-c--product-experience-and-quality-lead). Package IDs (`P#-##`) are the plan's.

**You own:** the React application and its API client boundary, the feed, detail, timeline, filters and reviewer screens, loading/empty/partial/error states, responsiveness and accessibility, CI and Docker Compose, Playwright end-to-end tests, and the release checklist and demo flow.

**You do not wait for the pipeline.** Build against the draft OpenAPI contract and fixtures from Phase 1, and switch to the real API once P4-01 – P4-03 exist.

**Your Phases 2–3 are lighter by design.** Use them for the Playwright harness, fixture-driven components, and a leading share of dataset labelling (P3-01), which is the largest non-coding cost on the critical path.

**Backup role:** you cover release operations and documentation.

## Tasks

| ID | Task | Requirements | Gate | Size | Reviewer | Depends on | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| P1-01 | Facilitate decisions: feeds, topics, languages, retention, evaluation volume, hosting | PRD open decisions | G1 | S | Team | – | Not started |
| P1-02 | Repository structure, contribution guide, environment example, conventions | NFR-07 | G1 | S | Bao | P1-01 | Not started |
| P1-06 | React app: routing, API boundary, accessible shell | NFR-06, NFR-07 | G1 | M | Bao | P1-02 | Not started |
| P1-07 | Docker Compose and CI: format, static analysis, tests, migration-from-empty, requirement-ID check | NFR-07, NFR-08 | G1 | M | Bao | P1-03 – P1-06 | Not started |
| P2-06b | Article/processing inspection screen *(UI half of plan P2-06)* | FR-ING-05 | G2 | S | Bao | P2-06a | Not started |
| P3-10 | Explainability display for internal inspection | enables FR-ADM-01 | G3 | S | Bao | P3-07, P3-08 | Not started |
| P4-04 | Event feed, detail, timeline, provenance, filter controls and source disclosure UI | FR-EVT-01, FR-EVT-02, FR-EVT-03, FR-EVT-05 | G4 | L | Bao | P4-01 – P4-03 | Not started |
| P4-05 | Unknown/ambiguous location and partial-data states | FR-EVT-04, NFR-05 | G4 | M | Bao | P4-04 | Not started |
| P4-06 | Responsive and accessibility verification | NFR-06 | G4 | M | Bao | P4-04, P4-05 | Not started |
| P4-07 | Reader-journey Playwright suite | NFR-08 | G4 | M | Bao | P4-04, P4-05 | Not started |
| P5-02b | Correction UI for the one audited correction *(UI half of plan P5-02)* | FR-ADM-02, FR-ADM-03 | G5 | M | Bao | P5-01, P5-02a | Not started |
| P5-06 | Accessibility and performance regression pass | NFR-03, NFR-06 | G5 | M | Bao | P4 gate | Not started |
| P5-10 | Release candidate, tag, handoff documentation and presentation rehearsal | release success definition | G6 | M | Team | P5-07 – P5-09 | Not started |

Supporting (not owned): labelling a share of the evaluation dataset ([P3-01](phat-pipeline.md)); consulting on source licensing and retention (D-04).

## Acceptance Criteria

**P1-01 – Decisions**
- Each Week 1–2 item in [PRD §10](../PRD.md#10-open-product-decisions) has an owner and a recorded outcome (see README decisions D-01 – D-09).

**P1-02 – Repository structure**
- The layout in [TRD §4](../TRD.md#4-proposed-repository-layout) is created, replacing the empty placeholder directories; a contribution guide records branch, review and definition-of-done rules; `.env.example` lists the [TRD §11.3](../TRD.md#113-configuration-baseline) variables with no real values.

**P1-06 – React shell**
- The app builds and runs, has routing, a typed API client in one module, and a keyboard-navigable shell with landmarks and a skip link.

**P1-07 – Compose and CI**
- `docker compose up` starts PostgreSQL, API, worker and web; a documented clean-start works for a new member.
- Pull requests run formatting, static analysis, unit and integration tests, migration from an empty database, a requirement-ID traceability check, and a secret and dependency scan; a failing check blocks merge.

**P2-06b – Inspection screen**
- A screen shows article processing state and errors from the P2-06a endpoint, so ingestion can be inspected without SQL.

**P3-10 – Explainability display**
- An internal view shows each candidate's component scores, combined score, threshold, configuration version and location confidence for a selected article.

**P4-04 – Reader UI**
- A reader can browse the feed, combine and clear topic/location/source/date/text filters, open an event, see time range, location state, source count and coverage timeline, and follow every contributing article's original link.
- The included-source list and a non-comprehensiveness statement are visible.

**P4-05 – Uncertainty and partial data**
- Unknown and ambiguous events are readable and clearly labelled with no fabricated coordinates; loading, empty, partial and failure states exist for each screen.

**P4-06 – Responsive and accessibility**
- Automated checks pass and a keyboard-only pass finds no blocker, at desktop and mobile widths (WCAG 2.1 AA targets: contrast, labels, focus, semantics).

**P4-07 – Reader-journey tests**
- Playwright covers the discover-and-verify journey from [PRD §6.1](../PRD.md#61-discover-and-verify-an-event) on deterministic fixtures. Gate G4 passes when it and the provenance tests pass.

**P5-02b – Correction UI**
- A reviewer can open an event or queue item, see scores and evidence, enter a required reason and apply the correction; the resulting change and audit entry are visible.

**P5-06 – Regression pass**
- Accessibility and p95 results are re-measured against Phase 4 and recorded; regressions are fixed or logged.

**P5-10 – Release**
- Every item in the [release checklist](../IMPLEMENTATION_PLAN.md#16-release-readiness-checklist) is ticked or its miss is documented; a tag exists; the demo and recorded fallback are rehearsed.
