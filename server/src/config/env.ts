import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const emptyToUndefined = (v: unknown): unknown =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  CLIENT_URL: z.url("CLIENT_URL must be a valid URL"), 
  API_URL: z.url("API_URL must be a valid URL"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  COOKIE_SECRET: z.string().min(32, "COOKIE_SECRET must be at least 32 characters"),

  ADMIN_SEED_EMAIL: z.preprocess(emptyToUndefined, z.email().optional()),
  ADMIN_SEED_PASSWORD: z.preprocess(emptyToUndefined, z.string().min(8).optional()),

  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  RESEND_FROM_EMAIL: z.email("RESEND_FROM_EMAIL must be a valid email"),
  ADMIN_NOTIFICATION_EMAIL: z.email("ADMIN_NOTIFICATION_EMAIL must be a valid email"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  
  // ADDED: Optional proxy for local development
  PROXY_URL: z.preprocess(emptyToUndefined, z.url().optional()),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const pretty = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  console.error(`\n\u274c Invalid or missing environment variables:\n${pretty}\n`);
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
