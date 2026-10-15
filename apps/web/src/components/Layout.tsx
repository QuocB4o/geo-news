import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { DETAIL_EVENT_ID } from "../data/fixtures";
import Icon from "./Icon";

export function Header() {
  const [lang, setLang] = useState<"vn" | "en">("vn");
  const navigate = useNavigate();
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-left">
          <Link to="/" className="brand" aria-label="Geo News — trang chủ">
            <span className="brand-mark">
              <Icon name="pin" size={16} />
            </span>
            <span className="brand-text">
              <span className="brand-name">Geo News</span>
              <span className="brand-sub">Vietnam</span>
            </span>
          </Link>
          <span className="divider-v" />
          <nav className="main-nav" aria-label="Chính">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Khám phá
            </NavLink>
            <NavLink to="/sources" className={({ isActive }) => (isActive ? "active" : "")}>
              Nguồn tin
            </NavLink>
            <NavLink to={`/events/${DETAIL_EVENT_ID}`} className={({ isActive }) => (isActive ? "active" : "")}>
              Dòng sự kiện
            </NavLink>
          </nav>
        </div>
        <div className="header-right">
          <button type="button" className="search-trigger" aria-label="Tìm sự kiện, địa phương" onClick={() => navigate("/search")}>
            <span className="row" style={{ gap: 6, flexWrap: "nowrap" }}>
              <Icon name="search" />
              <span className="t-body-sm header-search-label">Tìm sự kiện, địa phương...</span>
            </span>
            <kbd>⌘K</kbd>
          </button>
          <div className="lang" role="group" aria-label="Ngôn ngữ">
            <button type="button" aria-pressed={lang === "vn"} onClick={() => setLang("vn")}>VN</button>
            <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
          </div>
          <span className="avatar" aria-hidden="true">
            <Icon name="user" size={16} />
          </span>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="row" style={{ marginBottom: 8 }}>
              <span className="t-h3">Geo News</span>
              <span className="t-label-sm muted">· Vietnam Newsroom</span>
            </div>
            <p className="t-body-sm" style={{ color: "var(--on-surface-variant)", maxWidth: "28rem" }}>
              Nền tảng tổng hợp và định vị tin tức báo chí theo thời gian thực tại 63 tỉnh thành Việt Nam. Thu thập dữ liệu minh bạch, phân cụm sự kiện tự động theo địa lý và thời gian xuất bản.
            </p>
          </div>
          <div>
            <div className="t-label upper" style={{ marginBottom: 8 }}>Tra cứu &amp; Minh bạch</div>
            <Link to="/sources" className="t-body-sm">Danh bạ nguồn xuất bản</Link>
            <Link to={`/events/${DETAIL_EVENT_ID}`} className="t-body-sm">Phương pháp phân cụm vị trí</Link>
            <Link to="/sources#limitations" className="t-body-sm">Giới hạn phạm vi dữ liệu</Link>
          </div>
          <div>
            <div className="t-label upper" style={{ marginBottom: 8 }}>Tiêu chuẩn kỹ thuật</div>
            <p className="t-body-sm muted">
              Đặc tả API định tuyến không gian địa lý, chuẩn hóa Open Attribution và định danh thực thể báo chí chính quy theo thông tư quản lý thông tin điện tử.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="t-body-sm muted">
            Giới hạn phạm vi: Geo News tổng hợp thông tin từ các cơ quan báo chí chính thống được cấp phép tại Việt Nam. Các bài viết được nhóm thành sự kiện thống nhất theo mốc thời gian và địa điểm. Dữ liệu không đại diện cho toàn bộ các ấn phẩm báo chí xuất bản độc lập.
          </p>
          <span className="t-body-sm muted">© 2025 Geo News. All editorial rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
