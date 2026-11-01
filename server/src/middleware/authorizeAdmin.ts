import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import type { AdminRole } from "../types/index.js";

export const authorizeAdmin = (...allowedRoles: AdminRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.admin) {
      return next(new ApiError(401, "Not authenticated"));
    }
    if (!allowedRoles.includes(req.admin.role)) {
      return next(new ApiError(403, "Forbidden: Insufficient permissions"));
    }
    next();
  };
};
