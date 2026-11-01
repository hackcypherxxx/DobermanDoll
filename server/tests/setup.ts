import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { afterAll, beforeAll } from "vitest";

let mongoServer: MongoMemoryServer;

process.env.NODE_ENV = "test";
process.env.PORT = "5001";
process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/mock"; // overwritten below
process.env.CLIENT_URL = "http://localhost:3000";
process.env.API_URL = "http://localhost:5001";
process.env.JWT_SECRET = "test-secret-at-least-32-characters-long";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-at-least-32-characters-long";
process.env.COOKIE_SECRET = "test-cookie-secret-at-least-32-characters-long";
process.env.RESEND_API_KEY = "re_test";
process.env.RESEND_FROM_EMAIL = "noreply@test.com";
process.env.ADMIN_NOTIFICATION_EMAIL = "admin@test.com";
process.env.CLOUDINARY_CLOUD_NAME = "test";
process.env.CLOUDINARY_API_KEY = "test";
process.env.CLOUDINARY_API_SECRET = "test";

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
