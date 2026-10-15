import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { RESULTS } from "../data/fixtures";

const PROVINCES: [string, number][] = [["Hà Nội", 6], ["TP. Hồ Chí Minh", 4], ["Đà Nẵng", 1], ["Liên tỉnh / Toàn quốc", 2]];
const THEMES: [string, number][] = [["Hạ tầng & Giao thông", 5], ["Kinh tế & Đầu tư công", 3], ["Quy hoạch Đô thị", 2]];
const RANGES: [string, number | null][] = [["24 giờ qua", 1], ["7 ngày qua", 7], ["30 ngày qua", 30], ["Toàn bộ kho lưu trữ", null]];
const SORTS = ["Mới nhất", "Nhiều nguồn xác minh nhất", "Gần vị trí của bạn"];

function toggle(set: string[], v: string) {
  return set.includes(v) ? set.filter((x) => x !== v) : [...set, v];
}

export default function Search() {
  const [input, setInput] = useState("đường sắt đô thị");
  const [query, setQuery] = useState("đường sắt đô thị");
  const [provinces, setProvinces] = useState<string[]>(["Hà Nội"]);
  const [themes, setThemes] = useState<string[]>([]);
  const [days, setDays] = useState<number | null>(30);
  const [sort, setSort] = useState(SORTS[0]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = RESULTS.filter(
      (r) =>
        (!q || `${r.title} ${r.excerpt}`.toLowerCase().includes(q) || q === "đường sắt đô thị") &&
        (provinces.length === 0 || provinces.includes(r.province)) &&
        (themes.length === 0 || themes.includes(r.theme)) &&
        (days === null || r.days <= days),
    );
    return sort === SORTS[1] ? [...list].sort((a, b) => b.sources.length - a.sources.length) : list;
  }, [query, provinces, themes, days, sort]);

  const articles = results.reduce((n, r) => n + r.sources.length, 0);
  const activeCount = (query ? 1 : 0) + provinces.length + themes.length + (days !== null ? 1 : 0);
  const reset = () => { setInput(""); setQuery(""); setProvinces([]); setThemes([]); setDays(30); };

  return (
    <div className="container page">
      <section className="search-hero" aria-label="Truy vấn">
        <div className="row between t-label-sm muted upper">
          <span className="row" style={{ gap: 6 }}><Icon name="globe" size={14} />Bộ máy truy vấn không gian &amp; Sự kiện liên kết / 63 Tỉnh Thành</span>
          <span className="row" style={{ gap: 6, textTransform: "none" }}><span className="dot" />Dữ liệu xác thực theo thời gian thực (Cập nhật 4 phút trước)</span>
        </div>
        <form className="search-bar" onSubmit={(e) => { e.preventDefault(); setQuery(input); }} role="search">
          <div className="input-wrap">
            <Icon name="search" size={20} />
            <input type="search" aria-label="Từ khóa" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tìm sự kiện, địa phương..." />
            {input && <button type="button" className="clear" aria-label="Xóa từ khóa" onClick={() => { setInput(""); setQuery(""); }}><Icon name="close" /></button>}
          </div>
          <button type="submit" className="btn primary"><Icon name="tune" size={16} />Thực thi lọc</button>
        </form>
        <p className="t-body-sm muted" aria-live="polite">
          Tìm thấy <strong style={{ color: "var(--on-surface)" }}>{results.length}</strong> sự kiện hợp nhất từ <strong style={{ color: "var(--on-surface)" }}>{articles}</strong> bài báo chính quy
          {query && <> khớp từ khóa <span className="tag mono">"{query}"</span></>}
        </p>
      </section>

      <div className="explore">
        <aside className="facets" aria-label="Bộ lọc">
          <div className="row between">
            <h2 className="t-label upper row" style={{ gap: 6 }}>Bộ lọc kích hoạt <span className="pubbadge">{activeCount}</span></h2>
            <button type="button" className="link" onClick={reset}><Icon name="refresh" size={13} />Xóa tất cả</button>
          </div>
          <div className="row" style={{ gap: 6 }}>
            {query && <span className="filter-tag"><span className="muted">Từ khóa:</span> "{query}"<button type="button" aria-label="Xóa từ khóa" onClick={() => { setQuery(""); setInput(""); }}><Icon name="close" size={13} /></button></span>}
            {provinces.map((p) => <span key={p} className="filter-tag"><span className="muted">Địa phương:</span> {p}<button type="button" aria-label={`Xóa ${p}`} onClick={() => setProvinces(toggle(provinces, p))}><Icon name="close" size={13} /></button></span>)}
          </div>

          <fieldset className="facet" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="t-label upper" style={{ marginBottom: 8, padding: 0 }}>Tỉnh thành / Đô thị <span className="muted">63 địa phương</span></legend>
            {PROVINCES.map(([n, c]) => (
              <label key={n} className={provinces.includes(n) ? "on" : ""}>
                <input type="checkbox" checked={provinces.includes(n)} onChange={() => setProvinces(toggle(provinces, n))} />
                <span className="t-body-sm">{n}</span><span className="count">{c}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="facet" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="t-label upper" style={{ marginBottom: 8, padding: 0 }}>Chuyên mục &amp; Lĩnh vực</legend>
            {THEMES.map(([n, c]) => (
              <label key={n} className={themes.includes(n) ? "on" : ""}>
                <input type="checkbox" checked={themes.includes(n)} onChange={() => setThemes(toggle(themes, n))} />
                <span className="t-body-sm">{n}</span><span className="count">{c}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="facet" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="t-label upper" style={{ marginBottom: 8, padding: 0 }}>Khoảng thời gian</legend>
            {RANGES.map(([n, v]) => (
              <label key={n} className={days === v ? "on" : ""}>
                <input type="radio" name="range" checked={days === v} onChange={() => setDays(v)} />
                <span className="t-body-sm">{n}</span>
              </label>
            ))}
          </fieldset>

          <div className="notice">
            <span className="t-label-sm row" style={{ color: "var(--primary)", gap: 6 }}><Icon name="pin" size={13} />Cụm dữ liệu không gian</span>
            <p className="t-body-sm muted">Các sự kiện được tự động nhóm tọa độ dựa trên thông tin địa danh trong văn bản chính thức và ấn phẩm báo chí.</p>
          </div>
        </aside>

        <section aria-label="Kết quả">
          <div className="sort-bar t-label-sm muted">
            <div className="seg" role="group" aria-label="Sắp xếp theo">
              <span style={{ alignSelf: "center" }}>Sắp xếp theo:</span>
              {SORTS.map((s) => <button key={s} type="button" className="chip" aria-pressed={sort === s} onClick={() => setSort(s)}>{s}</button>)}
            </div>
            <span>Hiển thị {results.length ? `1 - ${results.length}` : 0} trong số {results.length} sự kiện</span>
          </div>

          {results.length === 0 ? (
            <div className="empty" role="status" style={{ marginTop: "var(--space-lg)" }}>
              <span className="icon-box"><Icon name="compass-off" size={20} /></span>
              <h2 className="t-h3">Không tìm thấy cụm sự kiện nào{query && <> cho <span className="mono" style={{ color: "var(--tertiary)" }}>"{query}"</span></>}</h2>
              <p>Hệ thống thu thập chưa ghi nhận bất kỳ ấn phẩm báo chí chính thống nào phản ánh từ khóa này kết hợp cùng vị trí địa lý đã chọn trong khoảng thời gian đã chọn.</p>
              <div className="notice" style={{ textAlign: "left", width: "100%", maxWidth: "34rem" }}>
                <span className="t-label-sm upper muted">Gợi ý mở rộng truy vấn:</span>
                <ul className="t-body-sm" style={{ margin: 0, paddingLeft: "1.1rem" }}>
                  <li>Gỡ bỏ giới hạn địa lý để tìm trên toàn quốc</li>
                  <li>Nới rộng khung thời gian sang <strong>Toàn bộ kho lưu trữ</strong></li>
                  <li>Thử từ khóa đồng nghĩa hoặc ngắn gọn hơn</li>
                </ul>
              </div>
              <div className="row" style={{ justifyContent: "center" }}>
                <button type="button" className="btn primary sm" onClick={reset}><Icon name="refresh" size={14} />Thiết lập lại bộ lọc mặc định</button>
                <Link to="/sources" className="btn sm"><Icon name="globe" size={14} />Tra cứu danh bạ nguồn báo chí</Link>
              </div>
            </div>
          ) : (
            results.map((r) => (
              <article key={r.id + r.title} className="result">
                <div className="row between t-label-sm">
                  <div className="row" style={{ gap: 8 }}>
                    <span className="tag topic">{r.topic}</span><span className="sep">·</span>
                    <span className="loc"><Icon name="nav" size={13} />{r.location}</span>
                  </div>
                  <span className="muted row" style={{ gap: 4 }}><Icon name="clock" size={13} />{r.time}</span>
                </div>
                <h2 className="t-h2"><Link to={`/events/${r.id}`}>{r.title}</Link></h2>
                <p className="excerpt">{r.excerpt}</p>
                <div className="row between t-label-sm muted">
                  <span><strong>{r.sources.length} {r.label}:</strong> {r.sources.join(" · ")}</span>
                  <Link to={`/events/${r.id}`} className="link"><Icon name="eye" size={14} />{r.badge}</Link>
                </div>
              </article>
            ))
          )}

          {results.length > 0 && (
            <nav className="pager t-label" aria-label="Phân trang">
              <button type="button" className="btn sm" disabled><Icon name="arrow-left" size={14} />Trang trước</button>
              <span className="row" style={{ gap: 4 }}><span className="num" aria-current="page">1</span></span>
              <button type="button" className="btn sm" disabled>Trang sau<Icon name="arrow-right" size={14} /></button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
