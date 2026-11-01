import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import type { AuthenticatedAdmin } from "../types/index.js";

export const authenticateAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return next(new ApiError(401, "Not authenticated"));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedAdmin;
    req.admin = decoded;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
