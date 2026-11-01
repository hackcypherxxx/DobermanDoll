import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import { ApiError } from "../utils/ApiError.js";

type Source = "body" | "query" | "params";

interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/**
 * Validates the selected parts of the request against the given Zod schemas.
 * On success, replaces the source data with the parsed (and coerced) output
 * so downstream handlers consume typed, trusted values. On failure, throws
 * ApiError(400) carrying the Zod issues.
 */
export const validateRequest =
  (schemas: ValidationSchemas) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      for (const key of ["body", "query", "params"] as Source[]) {
        const schema = schemas[key];
        if (!schema) continue;
        const parsed = schema.parse(req[key]);
        // Express 5 makes req.query a getter-only property on some setups;
        // assign through a writable cast to keep behaviour consistent.
        (req as unknown as Record<Source, unknown>)[key] = parsed;
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(
          new ApiError(
            400,
            "Validation failed",
            err.issues.map((i) => ({
              path: i.path.join("."),
              message: i.message,
            }))
          )
        );
        return;
      }
      next(err);
    }
  };
