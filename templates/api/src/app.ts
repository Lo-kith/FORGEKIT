import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { healthRouter } from "./routes/health.routes.js";

export const app = express();

app.use(cors({ origin: env.webOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use("/api/health", healthRouter);
app.use(errorHandler);
