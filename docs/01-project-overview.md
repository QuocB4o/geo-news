# 01 – Project Overview

> **Status:** Planning stage. The repository contains requirements documents only. No source code, configuration, Docker, CI/CD or tests exist yet. Anything not stated in the existing PRD/TRD/feasibility study is marked `TBD – Requires project/team decision`.

## Project Background

News readers face **information overload**: many outlets publish near-identical reports of the same incident, and country filters usually reflect where a *publisher* is based rather than where an *event* happened. AI summaries can also hide where claims came from, which worsens trust problems.

Geo News (Location-Aware Event Explorer) is a Southeast Asia-focused news aggregator. It groups duplicate coverage into distinct, location-aware **events**, each with a timeline, a map position and links to every source article. The project began as one of three candidate directions in the feasibility study (`docs/v2.docx`: Smart Booking, Geo News, Specialized E-Commerce). Geo News was chosen for its NLP/clustering depth.

**Research question:** How can a news system reduce information overload by grouping duplicate coverage into location-aware events while preserving source provenance?

## Business Problem

| Problem | Effect on users |
| :--- | :--- |
| Information overload | Too many feeds compete for limited attention |
| Duplicate coverage | Ten outlets, one incident, ten near-identical items |
| Poor geographic discovery | Filters reflect publisher metadata, not event location |
| Provenance and trust | Summaries obscure where claims came from |
| AI hallucination | Generated summaries may add unsupported details |

## Goals

- Present one *event* instead of many duplicate articles.
- Make events explorable by location (map) and time (timeline).
- Preserve provenance: every event links to all original articles.
- Stay feasible for a 3-person student team, favouring algorithmic depth over data volume.

## Target Users

Not formally defined in the source documents. Implied: news readers in Vietnam / Southeast Asia who want a de-duplicated, location-aware view. Detailed personas: `TBD – Requires project/team decision`.

## Scope

| Dimension | Decision |
| :--- | :--- |
| Region | Vietnam, or 4–5 Southeast Asian countries (final choice `TBD`) |
| Sources | 5–15 reliable RSS / news API feeds (list `TBD`) |
| Topics | 3–5 core topics, e.g. politics, weather, business (final list `TBD`) |
| Deferred | Map view and grounded AI summary, built only after location extraction and clustering are proven |

## Feature Status

| Feature | Priority | Status |
| :--- | :--- | :--- |
| Event feed | Core | Planned |
| Event page (timeline + sources) | Core | Planned |
| Source provenance list | Core | Planned |
| Search and filters | Core | Planned |
| Accounts and bookmarks | Core | Planned |
| Map view | Secondary | Planned |
| Grounded AI summary | Secondary | Planned |

## Team

| Member | Domain |
| :--- | :--- |
| Member 1 | Backend core: API, auth, bookmarks, data models |
| Member 2 | AI and data pipeline: ingestion, NLP, embeddings, clustering, evaluation |
| Member 3 | Frontend: UI/UX, map, timeline, search and filters |

Team skills (from the feasibility study): Java and Python, DSA, OOP, databases, introductory AI.

## Current State and Limitations

- No implementation exists; the four top-level entries `Backend`, `Database`, `Frontend`, `ExternalServices` are **empty files, not directories**. They are untracked placeholders and are presumably meant to be directories (`TBD`).
- Technology choices remain open: backend (Java *or* FastAPI), frontend (React *or* Vue), map (Leaflet *or* Mapbox), vector store, geocoder, NER and summarization models.
- No CI/CD, containerization, environment config, test suite or security design yet.
- Inherent technical risks (see [04](04-system-architecture.md) and [05](05-technical-design.md)): false cluster merges/splits, wrong location extraction, summary hallucination, API rate limits, source-set bias.

## Document Map

| Doc | Purpose |
| :--- | :--- |
| [02-prd.md](02-prd.md) | Product requirements |
| [03-srs.md](03-srs.md) | Functional and non-functional requirements |
| [04-system-architecture.md](04-system-architecture.md) | Components, data flow, decisions |
| [05-technical-design.md](05-technical-design.md) | Pipeline, algorithms, module design |
| [06-database-api-design.md](06-database-api-design.md) | Proposed schema and API |
| [07-testing-strategy.md](07-testing-strategy.md) | Test and evaluation approach |
| [08-deployment-guide.md](08-deployment-guide.md) | Environments and deployment |
