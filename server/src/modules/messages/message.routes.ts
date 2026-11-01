import { Router } from "express";
import { submitContactForm } from "./message.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  message: z.string().min(10),
});

const router = Router();
router.post("/", validateRequest({ body: contactSchema }), submitContactForm);

export default router;
