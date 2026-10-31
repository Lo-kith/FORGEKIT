import { HealthStatus } from "../components/HealthStatus";

export function HomePage() {
  return (
    <main className="hero">
      <p className="eyebrow">YOUR NEXT BIG IDEA STARTS HERE</p>
      <h1>Build bold.<br /><span>Ship fast.</span></h1>
      <p className="intro">
        Your React frontend and Express API are ready. Start shaping this foundation into something yours.
      </p>
      <HealthStatus />
      <p className="hint">Edit <code>web/src/pages/HomePage.tsx</code> to get started.</p>
    </main>
  );
}
