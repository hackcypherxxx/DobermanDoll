import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

type ErrorLike = {
  name?: string; 
  code?: number;  
  message?: string;
}; 

/** 
 * Central error handler. Runs after all routes and normalizes every thrown
 * value into the project-wide response envelope:
 *
 *   { "success": false, "message": "...", "errors": [] }
 *
 * Handles (in order): Zod validation errors, our own ApiError, Mongoose
 * duplicate-key / validation / cast errors, and finally any unhandled error
 * (which is logged and hidden behind a generic message in production).
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  const e = err as ErrorLike | null | undefined;

  if (e && e.code === 11000) {
    res.status(409).json({
      success: false,
      message: "A record with that value already exists",
      errors: [],
    });
    return;
  }

  if (e && e.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: e.message ?? "Validation error",
      errors: [],
    });
    return;
  }

  if (e && e.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid identifier format",
      errors: [],
    });
    return;
  }

  console.error("Unhandled error:", err);

  const message =
    env.NODE_ENV === "production"
      ? "Internal server error"
      : (e?.message ?? "Unknown error");

  res.status(500).json({
    success: false,
    message,
    errors: [],
  });
};
