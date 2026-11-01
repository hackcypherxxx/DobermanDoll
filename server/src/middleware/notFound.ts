import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

/**
 * Catch-all for unmatched routes. Registered after all route handlers and
 * before the error handler, so a request that reaches this point is known
 * to have no matching endpoint. Delegates to the global error handler.
 */
export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
