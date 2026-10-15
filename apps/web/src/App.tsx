import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { getVersion } from "./api";

function Home() {
  const [status, setStatus] = useState("checking API…");

  useEffect(() => {
    getVersion()
      .then((v) => setStatus(`API v${v.version} (${v.environment})`))
      .catch(() => setStatus("API unavailable"));
  }, []);

  return (
    <section>
      <h1>Events</h1>
      <p>No events yet. {status}</p>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header>
        <strong>Geo News</strong>
      </header>
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}
