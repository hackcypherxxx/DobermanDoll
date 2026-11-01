import argon2 from "argon2";
import { Admin } from "./admin.model.js";
import { ApiError } from "../../utils/ApiError.js";
import type { LoginInput } from "./auth.schema.js";

export const authService = {
  async login(data: LoginInput) {
    const admin = await Admin.findOne({ email: data.email });
    
    if (!admin) {
      throw new ApiError(401, "Invalid credentials");
    }
    
    if (!admin.isActive) {
      throw new ApiError(403, "Account is deactivated");
    }

    const isMatch = await argon2.verify(admin.passwordHash, data.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    return admin;
  },

  async hashPassword(password: string) {
    return argon2.hash(password);
  }
};
