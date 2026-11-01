import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { loginSchema } from "./auth.schema.js";
import { authenticateAdmin } from "../../middleware/authenticateAdmin.js";
import { loginLimiter } from "../../middleware/rateLimiter.js";

const router = Router();

router.post("/login", loginLimiter, validateRequest({ body: loginSchema }), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);
router.get("/me", authenticateAdmin, authController.me);

export default router;
