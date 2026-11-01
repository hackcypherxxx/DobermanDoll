import mongoose from "mongoose";
import { env } from "../../config/env.js";
import { Admin } from "./admin.model.js";
import argon2 from "argon2";

const seed = async () => {
  if (!env.ADMIN_SEED_EMAIL || !env.ADMIN_SEED_PASSWORD) {
    console.error("❌ ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set in .env");
    process.exit(1);
  }

  await mongoose.connect(env.MONGODB_URI);
  
  const existing = await Admin.findOne({ email: env.ADMIN_SEED_EMAIL });
  if (existing) {
    console.log("✓ Admin already exists");
    process.exit(0);
  }

  const passwordHash = await argon2.hash(env.ADMIN_SEED_PASSWORD);
  await Admin.create({
    email: env.ADMIN_SEED_EMAIL,
    passwordHash,
    name: "Super Admin",
    role: "SUPER_ADMIN",
  });

  console.log("✓ Admin seeded successfully");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
