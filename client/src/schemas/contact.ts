import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Your message must be at least 10 characters long"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
