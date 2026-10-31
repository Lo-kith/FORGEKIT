import type { ErrorRequestHandler } from "express";
import { logError } from "../utils/logger.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  logError("Unhandled API error:", error);
  if (response.headersSent) {
    next(error);
    return;
  }
  response.status(500).json({ error: "Internal server error" });
};
