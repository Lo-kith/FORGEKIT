import { apiBaseUrl } from "../lib/env";

export interface HealthResponse {
  status: "ok";
  database: "connected" | "connecting" | "disconnected";
  timestamp: string;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${apiBaseUrl}/health`);
  if (!response.ok) {
    throw new Error(`API health check failed (${response.status}).`);
  }
  return response.json() as Promise<HealthResponse>;
}
