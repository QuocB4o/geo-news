import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer, Header } from "./components/Layout";
import EventDetail from "./pages/EventDetail";
import Feed from "./pages/Feed";
import Search from "./pages/Search";
import Sources from "./pages/Sources";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 });
    else document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <ScrollToTop />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/search" element={<Search />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="*" element={<Feed />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
