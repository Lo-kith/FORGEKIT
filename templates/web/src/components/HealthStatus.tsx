import { useHealth } from "../hooks/useHealth";

export function HealthStatus() {
  const health = useHealth();

  if (health.loading) return <p className="status">Connecting to the API…</p>;
  if ("error" in health) return <p className="status status-error">{health.error}</p>;

  return (
    <div className="health-card">
      <p className="status"><span className="status-dot" /> API {health.data.status}</p>
      <p>Database: <strong>{health.data.database}</strong></p>
    </div>
  );
}
