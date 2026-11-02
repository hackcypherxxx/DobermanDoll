import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authService } from "./auth.service.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "none" as const,
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const admin = await authService.login(req.body);

  const payload = { id: admin._id.toString(), email: admin.email, name: admin.name, role: admin.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: admin._id.toString() });

  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: { admin: payload },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  res.status(200).json({ success: true, message: "Logged out successfully", data: {} });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Admin profile retrieved", data: { admin: req.admin } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, "No refresh token provided");

  const decoded = verifyRefreshToken(token);
  
  // In a real scenario, you'd fetch the admin from DB here to ensure they are still active
  // For now, we trust the refresh token payload to issue a new access token.
  const payload = { id: decoded.id }; 
  const newAccessToken = generateAccessToken(payload);

  res.cookie("accessToken", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.status(200).json({ success: true, message: "Token refreshed", data: {} });
});
