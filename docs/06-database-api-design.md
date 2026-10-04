# 06 – Database and API Design

> **Proposal only.** No schema or API exists in the repository. This is a design derived from the PRD/TRD features. Engine, naming and auth are `TBD – Requires project/team decision`.

## 1. Data Model

```mermaid
erDiagram
    SOURCE ||--o{ ARTICLE : publishes
    EVENT ||--o{ ARTICLE : groups
    USER ||--o{ BOOKMARK : saves
    EVENT ||--o{ BOOKMARK : "saved as"
    ARTICLE ||--o| ARTICLE_EMBEDDING : has
    PLACE ||--o{ EVENT : "located at"
    PLACE ||--o{ ARTICLE : "mentioned in"

    SOURCE { id pk; name; feed_url; country; language }
    ARTICLE { id pk; source_id fk; event_id fk; url; title; body; language; published_at; fingerprint; place_id fk; place_confidence }
    ARTICLE_EMBEDDING { article_id pk_fk; vector; model }
    EVENT { id pk; title; topic; place_id fk; location_status; first_seen_at; last_updated_at; summary }
    PLACE { id pk; name; country; lat; lon; geocode_cache_key }
    USER { id pk; email; password_hash; created_at }
    BOOKMARK { user_id fk; event_id fk; created_at }
```

### Notes

| Topic | Design |
| :--- | :--- |
| Uniqueness | `article.url` (normalized) and `article.fingerprint` unique/indexed to block duplicates |
| Location | `event.location_status` ∈ `resolved` / `unknown`; unknown events have null coordinates |
| Provenance | `article.event_id` preserves every contributing article and source |
| Embeddings | Stored in vector store or DB extension (`TBD`); keyed by article id and model name |
| Indexes | `article(published_at)`, `article(event_id)`, `event(last_updated_at)`, `event(topic)`, geo index on place (`TBD`) |
| Bookmark | Composite PK `(user_id, event_id)` |
| Passwords | Hashed only; algorithm `TBD` |

## 2. API (proposed REST/JSON)

Base path `/api/v1` (`TBD`). Auth: bearer token or session (`TBD`).

| Method | Path | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| GET | `/events` | no | Event feed. Query: `topic`, `country`, `from`, `to`, `q`, `page`, `size` |
| GET | `/events/{id}` | no | Event detail: summary, location, timeline |
| GET | `/events/{id}/articles` | no | Source articles with links and source names |
| GET | `/events/map` | no | Events with resolved location (marker data), filterable |
| GET | `/sources` | no | Sources included in the system |
| POST | `/auth/register` | no | Create account |
| POST | `/auth/login` | no | Authenticate |
| POST | `/auth/logout` | yes | End session (if session-based) |
| GET | `/bookmarks` | yes | List own bookmarks |
| PUT | `/bookmarks/{eventId}` | yes | Bookmark an event (idempotent) |
| DELETE | `/bookmarks/{eventId}` | yes | Remove bookmark |

### Example: `GET /api/v1/events/42`

```json
{
  "id": 42,
  "title": "Flooding in Da Nang",
  "topic": "weather",
  "location": { "name": "Da Nang", "lat": 16.05, "lon": 108.20, "status": "resolved", "confidence": 0.91 },
  "sourceCount": 7,
  "firstSeenAt": "2026-10-01T03:12:00Z",
  "lastUpdatedAt": "2026-10-01T09:40:00Z",
  "summary": null
}
```

Values are illustrative, not real data. `summary` is `null` until the secondary feature exists.

### Errors

Standard HTTP codes; body `{ "error": { "code": "...", "message": "..." } }` (format `TBD`). Pagination, rate limiting and versioning policy: `TBD`.
