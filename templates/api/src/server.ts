import { createServer } from "node:http";
import mongoose from "mongoose";
import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

const server = createServer(app);

server.listen(env.port, () => {
  console.info(`API listening at http://localhost:${env.port}`);
  void connectDatabase(env.mongoUri);
});

let shuttingDown = false;

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.info(`\n${signal} received; shutting down.`);
    server.close((error) => {
      if (error) {
        console.error("HTTP server shutdown failed:", error);
        process.exitCode = 1;
      }
      void mongoose.disconnect().catch((disconnectError: unknown) => {
        console.error("MongoDB shutdown failed:", disconnectError);
        process.exitCode = 1;
      });
    });
  });
}
