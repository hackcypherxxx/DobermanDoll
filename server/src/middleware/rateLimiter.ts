import rateLimit from "express-rate-limit";

/**
 * Global limiter applied to every request. Generous ceiling for normal
 * storefront browsing, still well below abuse thresholds.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
    errors: [],
  },
});

/**
 * Stricter limiter for login attempts to blunt credential-stuffing.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Too many login attempts, please try again later",
    errors: [],
  },
});

/**
 * Limiter for checkout and contact endpoints to slow enumeration and spam.
 */
export const writeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions, please try again later",
    errors: [],
  },
});
