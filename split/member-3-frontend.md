# Member 3 – Frontend and UX

Part of the [work split](README.md). Specs: [PRD features](../docs/02-prd.md#3-features), [API design](../docs/06-database-api-design.md#2-api-proposed-restjson), [testing strategy](../docs/07-testing-strategy.md).

**You own:** the React client: event feed, event page with timeline and sources, search and filters, login and bookmarks, the map, and the end-to-end tests.

**You do not wait for the pipeline.** You build against mocks of Member 1's API contract (BE-03) from Phase 1 and switch to the real API in Phase 3 (FE-10).

**You also drive two team decisions:** feed licensing (D-04), because it limits what article text the UI may show, and target users (D-10).

## Tasks

| ID | Task | SRS | Phase | Size | Depends on |
| :--- | :--- | :--- | :--- | :--- | :--- |
| FE-01 | Frontend scaffold | NFR-MAINT-1 | 1 | S | – |
| FE-02 | Mock API from the contract | – | 1 | S | BE-03 |
| FE-03 | UX: user flows and wireframes | all product FRs | 1 | M | D-10 |
| FE-04 | Event feed | FR-FEED-1 | 2 | M | FE-02, FE-03 |
| FE-05 | Event page: timeline and sources | FR-EVT-1, FR-PRV-1, FR-LOC-3 | 2 | L | FE-02, FE-03, D-04 |
| FE-06 | Sources page | FR-SRC-1 | 2 | S | FE-02 |
| FE-07 | Search and filters | FR-SRCH-1 | 3 | M | FE-04, BE-06, D-03 |
| FE-08 | Register, login, logout | FR-AUTH-1, NFR-SEC-1 | 3 | M | BE-07, D-09 |
| FE-09 | Bookmarks | FR-BKM-1 | 3 | S | FE-08, BE-08 |
| FE-10 | Switch to the real API | FR-FEED-1, FR-EVT-1, FR-PRV-1 | 3 | M | BE-05, PL-10 |
| FE-11 | Map view | FR-MAP-1 | 4 | M | BE-10, PL-14 (gate) |
| FE-12 | Summary display | FR-SUM-1 | 4 | S | BE-11, PL-14 (gate) |
| FE-13 | End-to-end tests | FR-FEED-1, FR-EVT-1, FR-BKM-1, FR-MAP-1 | 4 | M | FE-09, FE-10 |

Shared: label your third of the evaluation dataset ([PL-08](member-2-pipeline.md)) during Phases 2–3.

## Acceptance Criteria

**FE-01 – Frontend scaffold**
- A Vite + React + TypeScript app in `Frontend/` builds and runs, with routing, linting and Vitest set up.
- All backend calls go through one API client module that reads `API_BASE_URL`.

**FE-02 – Mock API from the contract**
- The app runs with no backend, serving responses that match the OpenAPI contract.
- Mock data includes an event with `unknown` location, an event with one source, an event with many sources, and an empty feed.

**FE-03 – UX: user flows and wireframes**
- Wireframes cover the feed, event page, search and filters, login and register, bookmarks, sources page and map.
- The team has reviewed them before FE-04 starts.
- Target users are written into [01](../docs/01-project-overview.md#target-users) (D-10).

**FE-04 – Event feed**
- The home page lists events, never raw articles, each with title, topic, location or "unknown", source count and last-updated time.
- Pagination, loading, empty and error states work.

**FE-05 – Event page: timeline and sources**
- The page shows a timeline of coverage in publish order and the full list of source articles, each with source name and a direct link to the original.
- The source count is visible.
- An event with `unknown` location says so plainly and shows no map pin.
- Article text shown stays within what D-04 allows.

**FE-06 – Sources page**
- Lists every source the system includes.
- States that coverage is limited to these sources and makes no claim of completeness.

**FE-07 – Search and filters**
- Users can filter by topic, country or location, and time range, and search by text; filters combine.
- Filter state is kept in the URL so a view can be shared or reloaded.

**FE-08 – Register, login, logout**
- Register and login forms work with clear validation and error messages.
- Logout discards the token in the client, as assumed in the [README](README.md#7-issues-found-in-the-docs) and confirmed by D-09.
- An expired or invalid token sends the user back to login without losing the page they were on.

**FE-09 – Bookmarks**
- A logged-in user can bookmark and un-bookmark from the feed and the event page, and see a list of bookmarks.
- A logged-out user who tries to bookmark is prompted to log in.

**FE-10 – Switch to the real API**
- Feed, event page and sources page run on the real backend with real clustered events.
- Mocks remain available for tests and offline development.
- Any contract mismatches found are fixed in the contract first, then in code.

**FE-11 – Map view** *(only if the gate passes)*
- Leaflet with OpenStreetMap tiles shows a marker for each event with `resolved` location; a marker opens its event.
- Events with `unknown` location never appear on the map.
- The map respects the same filters as the feed.

**FE-12 – Summary display** *(only if the gate passes)*
- When an event has a summary, it is shown with its attribution links and labeled as generated.
- When `summary` is `null`, the page looks complete without it.

**FE-13 – End-to-end tests**
- Playwright covers feed → event page → login → bookmark.
- If the map is built, a test confirms `unknown`-location events are absent from it ([07 §5](../docs/07-testing-strategy.md#5-requirement-coverage)).
- The tests run in CI.
