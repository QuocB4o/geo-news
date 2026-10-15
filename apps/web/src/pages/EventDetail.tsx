import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import { DETAIL } from "../data/fixtures";

export default function EventDetail() {
  const d = DETAIL;
  return (
    <div className="container page">
      <div className="row between t-label muted">
        <nav aria-label="Breadcrumb" className="crumbs">
          <Link to="/" className="row" style={{ gap: 4 }}><Icon name="arrow-left" size={14} /> Bảng tin sự kiện</Link>
          <span>/</span>
          <span>{d.category}</span>
          <span>/</span>
          <span className="tag bordered mono">#{d.id}</span>
        </nav>
        <div className="row">
          <button type="button" className="btn sm"><Icon name="share" size={14} /> Chia sẻ hồ sơ</button>
          <button type="button" className="btn sm" onClick={() => window.print()}><Icon name="print" size={14} /> Lưu tài liệu</button>
        </div>
      </div>

      <header className="detail-head">
        <div className="row t-label">
          <span className="tag topic" style={{ background: "var(--surface-high)", color: "var(--primary)" }}>{d.topicTag}</span>
          <span className="loc"><Icon name="pin" size={15} />{d.location}</span>
          <span className="muted row" style={{ gap: 4 }}><Icon name="clock" size={14} />{d.updated}</span>
        </div>
        <h1 className="t-h1">{d.title}</h1>
        <p className="lead">{d.lead}</p>
        <div className="stats">
          <div className="stat"><span className="t-label-sm muted upper">Bài báo ghi nhận</span><strong>05<small>ấn phẩm độc lập</small></strong></div>
          <div className="stat"><span className="t-label-sm muted upper">Cơ quan xuất bản</span><strong>05<small>cơ quan cấp phép</small></strong></div>
          <div className="stat">
            <span className="t-label-sm muted upper">Độ tin cậy vị trí</span>
            <span className="t-label row" style={{ color: "var(--primary)", justifyContent: "space-between" }}>
              Cao (Phân vùng quy hoạch) <Icon name="shield-check" size={16} />
            </span>
          </div>
          <div className="stat"><span className="t-label-sm muted upper">Cửa sổ hội tụ tin</span><strong>04g 15p<small>chu kỳ gom cụm</small></strong></div>
        </div>
      </header>

      <div className="detail-grid">
        <div className="stack" style={{ gap: "var(--space-xl)" }}>
          <section aria-labelledby="tl">
            <div className="section-title">
              <h2 id="tl" className="t-h3 row"><span className="dot" />Dòng thời gian thu thập nguồn</h2>
              <span className="tag bordered muted"><Icon name="history" size={14} />Trình tự phát hành gốc (08:30 → 10:15)</span>
            </div>
            <ol className="timeline">
              {d.items.map((it, i) => (
                <li key={it.time} className={i === 0 ? "latest" : ""}>
                  <div className="row t-label" style={{ gap: 8 }}>
                    <span style={{ color: "var(--primary)" }}>{it.time} GMT+7</span>
                    <span className="tag bordered">{it.kind}</span>
                    <span className="muted">· {it.outlet}</span>
                  </div>
                  <h3 className="t-h3">{it.title}</h3>
                  <p>{it.body}</p>
                  <div className="row t-label muted" style={{ marginTop: 6, gap: 12 }}>
                    <a className="link" href="#provenance">Xem bản tin gốc <Icon name="external" size={13} /></a>
                    <span>{it.note}</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="stack" style={{ gap: "var(--space-lg)" }} aria-label="Ngữ cảnh địa lý">
          <section className="card side-card">
            <div className="row between">
              <h2 className="t-h3">Không gian địa lý</h2>
              <span className="tag bordered muted">Bản đồ quy hoạch</span>
            </div>
            <div className="map" role="img" aria-label="Sơ đồ vị trí các địa điểm liên quan khu vực Hà Nội">
              <span className="pin" style={{ left: "30%", top: "28%" }} />
              <span className="pin" style={{ left: "52%", top: "58%" }} />
              <span className="pin" style={{ left: "60%", top: "50%" }} />
              <span className="pin" style={{ left: "44%", top: "36%" }} />
            </div>
            <span className="t-label-sm muted upper">Các địa điểm liên quan trực tiếp</span>
            {d.places.map(([n, w]) => (
              <div key={n} className="kv t-body-sm"><span className="row" style={{ gap: 6 }}><span className="dot" />{n}</span><span className="muted">{w}</span></div>
            ))}
          </section>

          <section className="card side-card">
            <h2 className="t-h3">Tiêu chí kiểm định dữ liệu</h2>
            <div className="kv t-body-sm"><span className="muted">Thuật toán phân cụm</span><span>Geo-Temporal v2.4</span></div>
            <div className="kv t-body-sm"><span className="muted">Độ trùng khớp thực thể</span><strong style={{ color: "var(--primary)" }}>98.4%</strong></div>
            <div className="kv t-body-sm"><span className="muted">Trạng thái xác thực</span><span className="status"><span className="dot" />Đã công bố</span></div>
            <div className="kv t-body-sm"><span className="muted">Mã truy nguyên nội bộ</span><span className="tag bordered mono">SHA256:7f90c3</span></div>
            <Link to="/sources" className="btn sm" style={{ marginTop: 6 }}>Xem danh mục 63 nguồn cấp phép</Link>
          </section>

          <section className="notice" style={{ borderLeftColor: "var(--outline-variant)" }}>
            <span className="t-label-sm muted upper">Phản hồi biên tập</span>
            <p className="t-body-sm" style={{ color: "var(--on-surface-variant)" }}>
              Phát hiện thông tin chưa chính xác về ranh giới hành chính hoặc địa điểm ghi nhận? Hãy gửi yêu cầu rà soát cho nhóm kiểm duyệt dữ liệu.
            </p>
            <a className="link" href="mailto:editorial@example.invalid">Gửi báo cáo thẩm định <Icon name="arrow-right" size={14} /></a>
          </section>
        </aside>
      </div>

      <section id="provenance" aria-labelledby="pv" className="stack" style={{ gap: "var(--space-md)", paddingTop: "var(--space-lg)", borderTop: "1px solid var(--surface-high)" }}>
        <h2 id="pv" className="t-h3 row"><Icon name="shield-check" size={20} />Minh chứng &amp; Nguồn gốc bài báo (Provenance Audit)</h2>
        <p className="t-body-sm" style={{ color: "var(--on-surface-variant)", maxWidth: "46rem" }}>
          Bạn có thể tự kiểm chứng độc lập tất cả bài viết được nạp vào cụm dữ liệu này. Nhấp vào đường dẫn bên dưới để xem trực tiếp ấn phẩm gốc trên trang web của từng cơ quan báo chí.
        </p>
        <div className="prov">
          {d.items.map((it, i) => (
            <div key={it.host} className="prov-item">
              <div className="stack" style={{ gap: 4 }}>
                <div className="row t-label-sm muted" style={{ gap: 8 }}>
                  <span className={i === 0 ? "pubbadge" : "pubbadge alt"}>{it.outlet.replace("Báo ", "")}</span>
                  {it.time} GMT+7 · 15/10/2023
                </div>
                <div className="t-body-sm" style={{ color: "var(--on-surface)", fontSize: 15 }}>{it.title}</div>
                <div className="t-label-sm muted row" style={{ gap: 4 }}><Icon name="pin" size={13} />Thực thể địa lý: {it.entities}</div>
              </div>
              <a className="btn sm" href="#provenance" aria-label={`Mở bài gốc tại ${it.host}`}>Mở tại {it.host} <Icon name="external" size={13} /></a>
            </div>
          ))}
        </div>
      </section>

      <section className="notice" aria-labelledby="cn">
        <h2 id="cn" className="t-h3 row"><Icon name="doc" size={18} />Thông tri về phương thức gom cụm dữ liệu (Coverage Notice)</h2>
        <p className="t-body-sm" style={{ color: "var(--on-surface-variant)" }}>
          <strong>Geo News</strong> áp dụng nguyên tắc nhóm luồng tin tự động từ các cơ quan báo chí chính thống được cấp phép hoạt động tại Việt Nam. Các bài viết được liên kết dựa trên mối tương quan thời gian thực, thuật toán nhận dạng thực thể địa danh (NER) và phân tích ngữ nghĩa không gian địa lý.
        </p>
        <div className="grid-2 t-body-sm">
          <p className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}><Icon name="check" size={16} /><span><strong>Không tóm tắt bằng AI:</strong> Toàn bộ diễn biến trình bày theo tiêu đề và nội dung công bố gốc để đảm bảo tính khách quan tối đa.</span></p>
          <p className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}><Icon name="check" size={16} /><span><strong>Giới hạn phạm vi:</strong> Cụm sự kiện có thể không bao quát hết mọi quan điểm xã hội ngoài các bản tin chính thức đã ghi nhận.</span></p>
        </div>
      </section>

      <div className="page-end t-label">
        <Link to="/" className="link link-muted"><Icon name="arrow-left" size={14} /> Quay lại trang khám phá</Link>
        <a href="#top" className="link link-muted" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0 }); }}>Lên đầu trang <Icon name="arrow-up" size={14} /></a>
      </div>
    </div>
  );
}
