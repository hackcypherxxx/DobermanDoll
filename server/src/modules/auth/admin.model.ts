import mongoose, { Schema, Document } from "mongoose";
import type { AdminRole } from "../../types/index.js";

export interface AdminDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<AdminDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["SUPER_ADMIN", "ADMIN"], default: "ADMIN" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const Admin = mongoose.model<AdminDocument>("Admin", adminSchema);
