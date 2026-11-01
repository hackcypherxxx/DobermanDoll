import type { AuthenticatedAdmin } from "./index.js";

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}

export {};
