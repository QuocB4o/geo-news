# Huy's Role Guide: Product Experience and Quality

This guide explains what Huy owns, why the work matters, and how to approach each assigned task. It is written for someone learning the frontend and quality responsibilities of Geo News.

The repository is currently at the documentation stage. The paths and workflows below describe planned implementation, not software that already runs. This guide does not change task ownership, requirements, or status.

Read the [assigned task list](../split/huy-frontend.md) for task IDs, sizes, reviewers, dependencies, and status. The [PRD](PRD.md) defines product intent, the [TRD](TRD.md) defines the technical baseline, the [SPEC](SPEC.md) defines acceptance evidence, and the [Implementation Plan](IMPLEMENTATION_PLAN.md) defines phases and gates. Those documents remain authoritative.

## 1. What the Role Means

Huy is the Product Experience and Quality Lead, mapped to Person C in the plan. The role turns the backend's event data into a reader experience people can understand and verify, and makes that experience reproducible for teammates and release reviewers.

A reader should be able to find an event, understand its location and time, compare its coverage, and open the original articles. A reviewer should be able to inspect questionable results and complete one correction with a visible audit record. Huy also owns the local startup experience, CI coordination, browser tests, accessibility checks, and release coordination.

| Responsibility | Huy's contribution | Main collaborator |
| :--- | :--- | :--- |
| Reader experience | React shell, feed, filters, details, timeline, source disclosure, and all screen states | Bao supplies API contracts and endpoints |
| Internal inspection and correction | Processing and scoring views, correction form, visible results and audit information | Bao supplies protected inspection/correction APIs; Phat supplies scoring evidence |
| Accessibility and responsiveness | Keyboard navigation, labels, focus, contrast, and usable mobile layouts | Bao reviews; team helps with manual checks |
| Development quality | Compose startup, CI checks, and deterministic browser tests | Bao and Phat provide their services, migrations, tests, and fixtures |
| Release | Checklist coordination, handoff documentation, tag and demonstration rehearsal | Bao owns deployment/recovery; Phat owns evaluation and demo dataset |

The React app talks to the product API. It does not query PostgreSQL, poll feeds, run models, or recompute clustering decisions. Huy displays the API's data and states; Bao and Phat own the backend and pipeline rules.

Accounts, bookmarks, maps, and generated summaries are deferred P2 capabilities. The committed frontend release covers the reader journey and one complete audited P1 correction. Additional correction operations depend on capacity and the Week 10 scope gate.

## 2. Concepts to Understand First

| Concept | Meaning in this project |
| :--- | :--- |
| Article versus event | An article is one source's report. An event groups related reports while preserving every source article and link. |
| Provenance | Evidence of where information came from: source identity, original URL, publication time, and contributing articles. Duplicate coverage must retain its original links. |
| React, TypeScript, and Vite | The chosen UI framework, language for checking data shapes, and development/build tooling. These are the planned web stack. |
| API boundary | One typed client module responsible for requests, responses, and safe errors. Screens use it instead of scattering request logic across components. |
| OpenAPI contract | The agreed paths, parameters, response fields, and errors shared between frontend and backend. TypeScript alone does not validate a server response at runtime. |
| Fixture | A controlled example feed, event, or response that makes development and tests repeatable without live providers. |
| Cursor pagination | The server supplies a cursor for the next batch of events. The UI treats it as opaque and follows the agreed contract. |
| Location state | `resolved` means a validated primary place; `unknown` means no safe resolution; `ambiguous` means meaningful candidates exist without a safe primary choice. |
| Explainability | Stored evidence of a clustering decision: candidate events, component scores, combined score, threshold, and configuration version. |
| CI | Automated checks on a pull request that catch problems before integration. Merge-blocking checks also need repository branch protection configured by someone with access. |
| Playwright | The planned browser test tool for exercising real reader and reviewer journeys. |
| Gate | Evidence that an integrated phase works. Completing one frontend task does not automatically pass the whole gate. |

For example, two outlets covering the same incident can become one event with two contributing articles. The UI still exposes both original links. If the location cannot be safely resolved, the event remains readable and is labelled unknown or ambiguous.

## 3. Work Order and Phase Goals

| Weeks | Huy's owned tasks | Integrated goal |
| :--- | :--- | :--- |
| 1–2 | P1-01, P1-02, P1-06, P1-07 | G1: a teammate starts the stack, loads a fixture, and sees an event through the real API in the browser |
| 3–4 | P2-06b | G2: ingestion failures and processing states are inspectable without SQL |
| 5–6 | P3-10 | G3: clustering decisions are explainable and the team has a reproducible baseline report |
| 7–8 | P4-04, P4-05, P4-06, P4-07 | G4: reader discovery, provenance, and filters pass browser acceptance tests |
| 9–12 | P5-02b, P5-06, P5-10 | G5: one audited correction and hardening by Week 10; G6: reproducible, tagged, demonstrable release by Week 12 |

Start with decisions and repository conventions, then the React shell and shared API boundary. Coordinate Compose and CI as the API, database, and worker foundations become available.

Build UI components against the draft contract and fixtures from Phase 1. Do not wait for the ML pipeline to finish. Fixture-based development enables early progress, but integrated acceptance still requires the real API and pipeline. During the lighter Phases 2–3, build the browser harness and help label the evaluation dataset under Phat's guidelines.

## 4. The 13 Assigned Tasks

Each task below explains its purpose, a practical approach, and the evidence to bring to review. Bao reviews Huy's tasks except P1-01 and P5-10, which the team reviews. Formal dependencies and requirement IDs remain in the [assignment table](../split/huy-frontend.md).

### P1-01 — Facilitate Product and Delivery Decisions

**Purpose:** Give the team a shared scope before implementation starts. Huy coordinates decisions; the named decision drivers still own their recommendations.

**Approach:** Review D-01 through D-09 in the [work split](../split/README.md). Record the decision, owner, date, rationale, and what it blocks. Bring content-retention options for D-04 and hosting/demo constraints for D-06. Help Phat agree initial topics in D-02. Check the scope against the assessment rubric with the team.

**Deliverable and evidence:** Week 1–2 product decisions have owners and recorded outcomes. Unresolved questions have explicit blockers and deadlines rather than silently becoming implementation assumptions.

### P1-02 — Establish Repository and Contribution Conventions

**Purpose:** Make the project understandable and reproducible for all three members.

**Approach:** Coordinate the proposed TRD layout: `apps/api/`, `apps/web/`, `workers/pipeline/`, `packages/geo_news/`, `db/`, and `tests/fixtures/`. Replace empty placeholders as scaffolding lands. Write contribution rules for short branches, review, linked requirement IDs, and the definition of done. Add `.env.example` using the TRD configuration baseline with placeholder values and document which variables belong to which service.

**Deliverable and evidence:** The agreed layout exists, a contributor can locate each component, and configuration/setup instructions are clear. No real credentials enter tracked files. Only browser-safe configuration may enter the web build; database credentials and server secrets stay server-side.

**Dependency:** P1-01. Coordinate with Bao and Phat so restructuring does not disrupt their scaffolding work.

### P1-06 — Build the Accessible React Shell

**Purpose:** Create the foundation every reader and reviewer screen will use.

**Approach:** Set up React, TypeScript, and Vite in `apps/web/`. Add routing, navigation, main content landmarks, a skip link, visible keyboard focus, and one typed API client module. Agree request/response and error shapes with Bao. Use fixtures for unfinished endpoints and keep that substitution at the API boundary.

**Deliverable and evidence:** The app builds and runs; routes work; keyboard users can reach navigation and main content; and a fixture event can be displayed. Requests use the agreed API origin and safe error handling. The initial shell does not need every final screen.

**Dependencies:** P1-02; Bao's P1-03 supplies draft OpenAPI and health/version/error contracts before the shell is finished.

### P1-07 — Provide Docker Compose and CI

**Purpose:** Make startup repeatable and prevent broken changes from entering the shared branch.

**Approach:** Coordinate PostgreSQL with pgvector, API, worker, and web services in Compose. Document configuration, migrations, fixture loading, startup, and shutdown. Assemble checks from each owner rather than implementing their domain tests yourself. Coordinate required-check settings with whoever can administer the repository.

**Deliverable and evidence:** A clean environment starts all four services through documented commands and shows the G1 fixture event. Pull requests check Markdown/internal links/Mermaid, formatting, static analysis, unit/integration tests, migration from empty, OpenAPI/client compatibility, requirement IDs, deterministic E2E, and secret/dependency scans as required by SPEC §9. Failing required checks block merge.

**Dependencies:** P1-03 through P1-06. Bao owns API/migration behavior; Phat owns worker behavior. Missing components are integration blockers, not a reason to report the stack as complete.

### P2-06b — Show Article Processing State

**Purpose:** Let the team investigate ingestion without manually querying the database.

**Approach:** Build the inspection screen against Bao's P2-06a endpoint. Show article identity and provenance plus stage, status, safe error code/reason, attempts, and timestamps. Provide loading, empty, and failure states. Agree access protection under D-09 before exposing the screen.

**Deliverable and evidence:** A fixture failure is visible and understandable in the screen; successful and failed records can be inspected without SQL. Internal traces, secrets, and unrestricted article bodies are not rendered.

**Dependency:** P2-06a. The inspection endpoint is missing from the current baseline API list; agree its contract with Bao rather than inventing a permanent route here.

### P3-10 — Display Decision Explainability

**Purpose:** Make automated grouping understandable to an internal reviewer.

**Approach:** For a selected article, display candidate events, semantic/entity/location/time component scores, combined score, threshold, configuration version, and location confidence/evidence supplied by the API. Label missing evidence clearly. Agree the protected read contract with Bao and field meanings with Phat.

**Deliverable and evidence:** A reviewer can compare candidates and understand the recorded decision. A fixture demonstrates the displayed values match stored evidence. The frontend does not recalculate scores or assume the initial scoring weights are permanent.

**Dependencies:** P3-07 and P3-08. This display supports later FR-ADM-01 review work; it does not itself implement corrections.

### P4-04 — Complete the Reader Experience

**Purpose:** Let a reader discover an event and verify its source coverage.

**Approach:** Build the published-event feed, event detail, coverage timeline, contributing-article links, and included-source disclosure. Each card shows title, topic, time, location state, and source count. Add topic, location, source, date, and supported text filters using Bao's contract; support combining and clearing filters. Follow cursor pagination and restart pagination when the filter set changes.

**Deliverable and evidence:** A reader finds an event, opens its detail, sees time range and coverage, and follows every contributing article's original link. The included-source list and a statement that coverage is not comprehensive are visible. Deterministic fixtures demonstrate combined filters, clearing, multiple pages, and cross-source duplicate provenance.

**Dependencies:** P4-01 through P4-03, stable event projections, and Phat's fixtures. The backend owns filter semantics and publication rules; the UI sends agreed parameters and shows results.

### P4-05 — Handle Uncertainty and Partial Data

**Purpose:** Preserve trust when data is incomplete or requests fail.

**Approach:** Make resolved, unknown, and ambiguous locations visibly distinct. Keep unknown and ambiguous events readable without selecting a guessed location or coordinates. Cover loading, empty, partial, and failure states on each screen. Keep successfully loaded information useful when a separate request fails, and make retry behavior clear.

**Deliverable and evidence:** Fixtures cover both uncertain location states and screen-level request failures. A reader can tell an empty result from a failed request and can still inspect available provenance in a partial result. No fabricated place or coordinate is presented.

**Dependency:** P4-04, with location meanings agreed from Phat's P3-04.

### P4-06 — Verify Responsive Layout and Accessibility

**Purpose:** Make the core journey usable on mobile and by keyboard users.

**Approach:** Run automated accessibility checks and manually traverse the reader journey at desktop and mobile widths. Check semantic headings/landmarks, labels, contrast, visible focus, navigation order, filter controls, and any dialog or error interaction. Record viewport sizes, findings, and fixes.

**Deliverable and evidence:** Automated checks pass and keyboard-only discovery and verification have no blocker at the tested widths. Record the manual evidence; automated checks alone do not establish WCAG 2.1 AA conformance.

**Dependencies:** P4-04 and P4-05.

### P4-07 — Automate the Reader Journey

**Purpose:** Catch integrated regressions in what readers actually do.

**Approach:** Use Playwright with deterministic fixtures. Exercise feed discovery, combined/cleared filters, event detail, uncertainty labels, timeline, and original links. Assert both source links remain available when duplicate coverage is grouped. Run the integrated scenario through the real API; fixture-backed component tests support it but do not replace it.

**Deliverable and evidence:** A repeatable command passes locally and in CI without live feed/geocoder/model dependencies. The suite verifies FR-EVT behavior and provenance, and failures retain useful browser evidence. Link the result to G4 alongside API/provenance checks.

**Dependencies:** P4-04 and P4-05. Prepare the harness earlier so these tasks do not finish without browser acceptance coverage.

### P5-02b — Implement One Audited Correction UI

**Purpose:** Let a reviewer safely correct one location or membership error end to end.

**Approach:** Agree the first supported operation with Bao. Open an event or queue item, show evidence and scores, collect a required reason, and submit the correction through the protected API. Prevent repeated submission while a request is pending. Handle validation, authorization, and stale-version conflicts without claiming success. After success, refresh affected data and show the result and audit information from the agreed API contract.

**Deliverable and evidence:** A deterministic browser scenario applies the correction and verifies updated membership/location, projections, and a visible audit entry. Negative cases demonstrate missing-reason and conflict/error handling. Bao's backend commits the change and audit atomically; frontend visibility does not replace backend authorization.

**Dependencies:** P5-01 and P5-02a. Full accounts remain deferred; D-09 must establish the protection and audit actor for this release. Do not put a server admin secret in a public frontend bundle.

### P5-06 — Repeat Accessibility and Performance Checks

**Purpose:** Ensure review/release changes have not degraded the reader MVP.

**Approach:** Repeat the Phase 4 accessibility checks and compare recorded results. Work with Bao to rerun seeded API timing with the same dataset and method. Record regressions, their severity, and fixes or accepted limitations.

**Deliverable and evidence:** A before/after report covers accessibility and public list/detail p95. NFR-03 targets 500 ms p95 on the declared seeded dataset, excluding client network latency; browser rendering time is a separate measurement. A missing seeded-volume decision (D-08) blocks a credible API comparison.

**Dependency:** G4. Bao owns P4-08 API performance measurement; Huy coordinates the regression pass.

### P5-10 — Coordinate Release and Handoff

**Purpose:** Turn completed work into a reproducible release the team can demonstrate and maintain.

**Approach:** Walk the [release checklist](IMPLEMENTATION_PLAN.md#16-release-readiness-checklist) with the team. Collect setup, migration, reader/correction, accessibility, performance, evaluation, recovery, and limitation evidence. Prepare handoff documentation and rehearse the deterministic demo and recorded fallback. Coordinate the release candidate and tag after the team approves the release.

**Deliverable and evidence:** A tagged build, usable handoff documentation, rehearsed demo, recorded fallback, and traceable release evidence exist. Record every checklist gap; documenting a gap does not waive a mandatory release condition or a critical defect.

**Dependencies:** P5-07 through P5-09. Phat owns final evaluation and demo fixtures; Bao owns deployment, backup/restore, rollback, and clean-install rehearsal. Huy supports these owners and coordinates the release. G6 requires unanimous team approval.

## 5. Handoffs and Supporting Work

| Handoff | What Huy needs or provides | When |
| :--- | :--- | :--- |
| Bao → Huy | Draft contract, safe error envelope, health/version endpoints | Before P1-06 finishes |
| Huy → team | Compose, CI, environment example, clean-start documentation | End of Phase 1 |
| Phat → Huy | Meaning of location states, confidence, scores, and deterministic fixtures | Before inspection and reader integration |
| Bao → Huy | Frozen reader schemas and stable event projections | Start of Phase 4 |
| Bao → Huy | Protected review queue, correction/version rules, and audit read contract | Before P5-02b |
| Huy → team | Browser, accessibility, regression, and release evidence | At the relevant gates |

For each contract, agree fields, optional/null values, pagination, filter behavior, safe errors, authorization, and sample responses. A later contract change needs the downstream owner's review before merge. Record a blocker and escalate to the team if it lasts more than one working day or threatens a gate.

Huy supports P3-01 by labelling a share of the evaluation dataset and reviewing the labelling guide. Phat owns the dataset process and adjudication rules. Keep disagreements recorded and preserve the tuning/held-out separation. Labelling coordination and P5-09 may be reassigned to Huy if Phat becomes overloaded, but the proposed fallback is not the current assignment.

Huy drives D-04 retention and D-06 hosting/demo decisions and assists with D-02 topics. Retention affects which article content can be stored, used in fixtures, and displayed; record the team decision before live ingestion or unrestricted content display.

## 6. A Practical First-Week Checklist

1. Read the reader journeys in the PRD, then Huy's task table and the TRD web/API boundaries.
2. Coordinate P1-01: identify each open decision's driver, deadline, and blocking tasks.
3. Agree P1-02 layout and contribution rules with Bao and Phat; prepare placeholder environment values.
4. Ask Bao for sample event, article, error, and health/version responses; distinguish draft fields from frozen contract fields.
5. Start P1-06 with routing, an accessible shell, and one API boundary; render a fixture event and original link.
6. Coordinate P1-07 services and CI, then rehearse the G1 path through the real worker, database, API, and browser.

Use small pull requests tied to the existing task and requirement IDs. The branch for this role guide is `feat/implement-role-fe`; this documentation change does not mark any implementation task complete.

## 7. What to Bring to Every Review

- Task ID, requirement IDs, scope, reviewer, dependencies, and any current blocker.
- Changed screens/contracts/configuration and the effect on Bao's or Phat's work.
- Relevant automated results and manual evidence, including failure and uncertain-data states.
- Reproduction steps using deterministic fixtures and the integrated milestone where applicable.
- Updated documentation and honest limitations, without secrets or prohibited article content.

Bao reviews the frontend tasks; the team reviews decision coordination and release. A task is complete when its acceptance evidence passes review and the integrated milestone remains reproducible. A mock screen, passing build, or screenshot alone does not establish end-to-end completion.
