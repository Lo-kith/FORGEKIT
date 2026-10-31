import { databaseStatus } from "../config/database.js";

export function getHealth() {
  return {
    status: "ok" as const,
    database: databaseStatus(),
    timestamp: new Date().toISOString(),
  };
}
