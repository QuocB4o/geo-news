import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { EVENTS, LOCATIONS, SOURCE_NAMES, TOPICS, type EventItem } from "../data/fixtures";

const PAGE = 5;

export function EventCard({ e }: { e: EventItem }) {
  return (
    <article className="card event-card">
      <div className="row between t-label">
        <div className="row" style={{ gap: 8 }}>
          <span className="tag topic">{e.topic}</span>
          <span className="sep">·</span>
          {e.ambiguous ? (
            <span className="loc ambiguous">
              <Icon name="compass-off" size={14} />
              {e.location}
              <strong className="t-label-sm upper">(Ambiguous location)</strong>
            </span>
          ) : (
            <span className="loc">
              <Icon name="pin" size={15} />
              {e.location}
              {e.ward && <small>({e.ward})</small>}
            </span>
          )}
          <span className="sep">·</span>
          <time className="muted">{e.time}</time>
        </div>
        <span className="t-label-sm muted">Verified cluster ({e.sources.length} articles)</span>
      </div>
      <h2 className="t-h2">
        <Link to={`/events/${e.id}`}>{e.title}</Link>
      </h2>
      <p className="excerpt">{e.excerpt}</p>
      <div className="foot">
        <div className="row" style={{ gap: 6 }}>
          <span className="t-label-sm muted" style={{ marginRight: 4 }}>Coverage from {e.sources.length} sources:</span>
          {e.sources.map((s) => (
            <span key={s} className="tag src">{s}</span>
          ))}
        </div>
        <Link to={`/events/${e.id}`} className="link">
          Explore event coverage ({e.sources.length} articles) <Icon name="arrow-right" size={16} />
        </Link>
      </div>
    </article>
  );
}

export default function Feed() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("Infrastructure");
  const [location, setLocation] = useState<string>("Hà Nội");
  const [source, setSource] = useState("all");
  const [range, setRange] = useState("7d");
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVENTS.filter(
      (e) =>
        (topic === "all" || e.topic === topic) &&
        (location === "all" || e.location === location) &&
        (source === "all" || e.sources.includes(source)) &&
        (!q || `${e.title} ${e.excerpt} ${e.location}`.toLowerCase().includes(q)),
    );
  }, [query, topic, location, source]);

  const reset = () => {
    setQuery(""); setTopic("all"); setLocation("all"); setSource("all"); setRange("7d");
  };
  const active = [
    location !== "all" && { k: "Location", v: location, clear: () => setLocation("all") },
    topic !== "all" && { k: "Topic", v: topic, clear: () => setTopic("all") },
    source !== "all" && { k: "Source", v: source, clear: () => setSource("all") },
  ].filter(Boolean) as { k: string; v: string; clear: () => void }[];

  return (
    <div className="container page">
      <section className="intro">
        <div>
          <div className="row" style={{ marginBottom: 4 }}>
            <span className="tag live"><span className="dot pulse" />Aggregating 18 sources</span>
            <span className="t-label-sm muted">· Updated 4m ago</span>
          </div>
          <h1 className="t-h1">Discover the stories behind the headlines.</h1>
          <p className="lead">Explore news events from multiple sources, organized by topic, location, and time across Vietnam.</p>
        </div>
        <Link to="/sources#limitations" className="link link-muted">
          <Icon name="info" size={16} /> Giới hạn phạm vi dữ liệu
        </Link>
      </section>

      <section className="filters" aria-label="Bộ lọc">
        <div className="input-wrap">
          <Icon name="search" size={20} />
          <input
            type="search"
            aria-label="Search events"
            placeholder="Search events, topics, or keywords across 63 provinces..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button type="button" className="clear" aria-label="Clear search" onClick={() => setQuery("")}>
              <Icon name="close" />
            </button>
          )}
        </div>
        <div className="filter-row">
          <div className="chips" role="group" aria-label="Topic">
            {["all", ...TOPICS].map((t) => (
              <button key={t} type="button" className="chip" aria-pressed={topic === t} onClick={() => setTopic(t)}>
                {t === "all" ? "All Topics" : t}
              </button>
            ))}
          </div>
          <div className="row">
            <label className="select">
              <span className="visually-hidden">Lọc theo địa phương</span>
              <select value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="all">All Vietnam</option>
                {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
              </select>
              <Icon name="down" size={16} />
            </label>
            <label className="select">
              <span className="visually-hidden">Lọc theo cơ quan báo chí</span>
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="all">All Sources (18)</option>
                {SOURCE_NAMES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <Icon name="down" size={16} />
            </label>
            <label className="select">
              <span className="visually-hidden">Lọc theo khoảng thời gian</span>
              <select value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="24h">Past 24 Hours</option>
                <option value="7d">Past 7 Days</option>
                <option value="30d">This Month</option>
              </select>
              <Icon name="down" size={16} />
            </label>
          </div>
        </div>
        <div className="active-bar">
          <div className="row" style={{ gap: 6 }}>
            <span className="t-label-sm muted upper">Active filters:</span>
            {active.map((f) => (
              <span key={f.k} className="filter-tag">
                <span className="muted">{f.k}:</span> {f.v}
                <button type="button" aria-label={`Xoá bộ lọc ${f.v}`} onClick={f.clear}><Icon name="close" size={14} /></button>
              </span>
            ))}
            {active.length > 0 && (
              <button type="button" className="t-label-sm muted underline" onClick={reset}>Clear all filters</button>
            )}
          </div>
          <div className="t-label muted" aria-live="polite">
            Showing <strong style={{ color: "var(--on-surface)" }}>{filtered.length}</strong> consolidated events
          </div>
        </div>
      </section>

      <section aria-label="Consolidated Event Stream" className="feed">
        {filtered.length === 0 ? (
          <div className="empty">
            <span className="icon-box"><Icon name="filter-off" size={20} /></span>
            <h2 className="t-h3">No events match these filters</h2>
            <p>Try removing a filter or widening the time range.</p>
            <button type="button" className="btn primary sm" onClick={reset}>Reset filters</button>
          </div>
        ) : (
          filtered.slice(0, shown).map((e) => <EventCard key={e.id} e={e} />)
        )}
      </section>

      <section className="load-more">
        {filtered.length > shown && (
          <button type="button" className="btn" onClick={() => setShown((n) => n + PAGE)}>
            Load more events <span className="muted">(Showing {Math.min(shown, filtered.length)} of {filtered.length})</span>
            <Icon name="down" />
          </button>
        )}
        <div className="row t-body-sm muted" style={{ gap: 16, justifyContent: "center" }}>
          <span>No matching criteria?</span>
          <button type="button" className="link" onClick={reset}>Reset filters</button>
          <span>·</span>
          <Link to="/sources#limitations" className="link-muted underline">View coverage limitations</Link>
        </div>
      </section>
    </div>
  );
}
