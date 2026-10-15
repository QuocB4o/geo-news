import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon, { type IconName } from "../components/Icon";
import { OUTLETS } from "../data/fixtures";

const CATS = [
  { id: "all", label: "All Outlets" },
  { id: "general", label: "General & National" },
  { id: "regional", label: "Regional & Municipal" },
  { id: "business", label: "Business & Economy" },
  { id: "wire", label: "Wire Agency" },
];

const PILLARS: { icon: IconName; title: string; body: string; foot: string; footIcon: IconName }[] = [
  { icon: "shield-check", title: "Approved Feeds", body: "We monitor public RSS and editorial API endpoints exclusively from licensed press agencies registered under the Ministry of Information and Communications (MIC) of Vietnam.", foot: "Regulated publisher identity only", footIcon: "shield" },
  { icon: "refresh", title: "Ingestion Cadence", body: "Feeds are queried at 5 to 15-minute intervals. Articles are parsed immediately through deterministic NLP pipelines for temporal validation and geospatial entity extraction.", foot: "Real-time polling & deduplication", footIcon: "clock" },
  { icon: "scale", title: "Editorial Neutrality", body: "Geo News does not assign subjective bias scores, political rankings, or proprietary algorithmic trust metrics. All clustered articles retain their original headlines and canonical permalinks.", foot: "Direct canonical reference guarantee", footIcon: "link" },
];

const LIMITS: { icon: IconName; title: string; body: string }[] = [
  { icon: "lock", title: "Open Access Exclusivity", body: "Geo News does not index paywalled or subscription-only content. Only freely accessible public RSS headlines and summaries are aggregated." },
  { icon: "shield", title: "No Social / Unverified Feeds", body: "Independent blogs, unverified social media channels, and unvetted content farms are systematically excluded from the ingestion pipeline." },
  { icon: "hub", title: "Algorithmic Co-occurrence", body: "Automated temporal clustering can occasionally group tangentially related reports during rapid breaking news cycles before human or cluster reconciliation occurs." },
  { icon: "compass-off", title: "Named Entity Dependent", body: "Location extraction relies strictly on Named Entity Recognition (NER) within the article text. Articles with ambiguous or unstated locations are categorized under Nationwide or Ambiguous." },
];

export default function Sources() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return OUTLETS.filter(
      (o) => (cat === "all" || o.cat === cat) && (!s || Object.values(o).join(" ").toLowerCase().includes(s)),
    );
  }, [q, cat]);
  const count = (id: string) => (id === "all" ? OUTLETS.length : OUTLETS.filter((o) => o.cat === id).length);

  return (
    <div className="container page">
      <div className="row between t-label muted">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Geo News</Link><span>/</span><span style={{ color: "var(--on-surface)" }}>Included Sources</span></nav>
        <span className="tag" style={{ background: "var(--surface-container)" }}><span className="dot" />Directory Index: {OUTLETS.length} Active Feeds · Updated 14:00 ICT Today</span>
      </div>

      <header className="stack" style={{ gap: 8 }}>
        <span className="tag topic live" style={{ alignSelf: "flex-start", background: "var(--surface-high)" }}>Transparency &amp; Governance</span>
        <h1 className="t-display">Included News Sources</h1>
        <p style={{ font: "400 17px/28px var(--font-body)", color: "var(--on-surface-variant)", maxWidth: "44rem" }}>
          A transparent index of approved Vietnamese news outlets and official editorial feeds monitored by Geo News. We publish this registry to guarantee auditability, geographic attribution accuracy, and open access standards.
        </p>
      </header>

      <section className="grid-3" aria-label="Nguyên tắc">
        {PILLARS.map((p) => (
          <div key={p.title} className="info-card">
            <span className="icon-box"><Icon name={p.icon} size={20} /></span>
            <h2 className="t-h3">{p.title}</h2>
            <p className="t-body-sm" style={{ color: "var(--on-surface-variant)" }}>{p.body}</p>
            <span className="t-label-sm muted row" style={{ gap: 6, marginTop: "auto", paddingTop: 12 }}><Icon name={p.footIcon} size={14} />{p.foot}</span>
          </div>
        ))}
      </section>

      <section className="panel stack" style={{ gap: "var(--space-md)" }} aria-label="Danh bạ nguồn">
        <div className="row between" style={{ gap: 12 }}>
          <div className="input-wrap" style={{ maxWidth: "26rem", flex: 1 }}>
            <Icon name="search" />
            <input type="search" aria-label="Search publications" placeholder="Search by publication name, coverage, or feed type..." value={q} onChange={(e) => setQ(e.target.value)} style={{ height: "2.5rem" }} />
          </div>
          <div className="chips" role="group" aria-label="Category">
            {CATS.map((c) => (
              <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                {c.label} ({count(c.id)})
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Publication / Agency</th><th scope="col">Scope &amp; Editorial Beat</th><th scope="col">Ingestion Format</th><th scope="col">Geographic Focus</th><th scope="col">Cadence / Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.code}>
                  <td>
                    <div className="row" style={{ gap: 12, flexWrap: "nowrap" }}>
                      <span className="src-ic" aria-hidden="true">{o.code}</span>
                      <div><div className="t-h3">{o.name}</div><div className="t-label-sm muted">{o.owner} · Vietnamese</div></div>
                    </div>
                  </td>
                  <td><div className="t-body-sm" style={{ color: "var(--on-surface)" }}>{o.beat}</div><div className="t-label-sm muted">{o.sub}</div></td>
                  <td><span className="tag" style={o.wire ? { background: "var(--surface-high)", color: "var(--primary)" } : undefined}>{o.format}</span></td>
                  <td className="t-body-sm"><span className="row" style={{ gap: 6, flexWrap: "nowrap" }}><Icon name="globe" size={16} />{o.focus}</span></td>
                  <td className="t-label"><span className="status"><span className="dot" />{o.cadence} · Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && (
          <div className="empty" role="status">
            <span className="icon-box"><Icon name="filter-off" size={20} /></span>
            <h3 className="t-h3">No publications match your filter</h3>
            <p>Try resetting the search keyword or choosing "All Outlets".</p>
            <button type="button" className="btn sm" onClick={() => { setQ(""); setCat("all"); }}>Reset</button>
          </div>
        )}
      </section>

      <section id="limitations" className="panel stack" style={{ gap: "var(--space-md)" }} aria-labelledby="lim">
        <div className="row" style={{ gap: 12, flexWrap: "nowrap" }}>
          <span className="icon-box"><Icon name="info" size={20} /></span>
          <div>
            <h2 id="lim" className="t-h3">Platform Coverage Limitations</h2>
            <p className="t-body-sm muted">Read these constraints to understand what Geo News collects and how geographic attribution functions.</p>
          </div>
        </div>
        <div className="grid-2">
          {LIMITS.map((l) => (
            <div key={l.title} className="card" style={{ padding: "var(--space-md)" }}>
              <h3 className="t-label row" style={{ gap: 8, fontSize: 15, marginBottom: 4 }}><Icon name={l.icon} size={16} />{l.title}</h3>
              <p className="t-body-sm" style={{ color: "var(--on-surface-variant)" }}>{l.body}</p>
            </div>
          ))}
        </div>
        <div className="card row between" style={{ padding: "0.75rem var(--space-md)" }}>
          <span className="row" style={{ gap: 8 }}><Icon name="doc" size={16} />Are you an accredited Vietnamese press outlet with a public RSS or NewsML endpoint?</span>
          <a className="btn primary sm" href="mailto:sources@example.invalid">Suggest a Source <Icon name="external" size={13} /></a>
        </div>
      </section>
    </div>
  );
}
