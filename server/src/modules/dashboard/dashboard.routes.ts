import { Router } from "express";
import { getStats } from "./dashboard.controller.js";
import { authenticateAdmin } from "../../middleware/authenticateAdmin.js";

const router = Router();
router.use(authenticateAdmin);
router.get("/", getStats);

export default router;
