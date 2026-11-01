import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { emailService } from "../../services/email.service.js";
import { env } from "../../config/env.js";

export const submitContactForm = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  
  const html = `<h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br/>${message}</p>`;

  await emailService.sendEmail(env.ADMIN_NOTIFICATION_EMAIL, `Contact Form: ${name}`, html);
  
  res.status(200).json({ success: true, message: "Message sent successfully", data: {} });
});
