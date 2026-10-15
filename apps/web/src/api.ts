const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function getVersion(): Promise<{ version: string; environment: string }> {
  const res = await fetch(`${API_BASE}/api/v1/version`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}
