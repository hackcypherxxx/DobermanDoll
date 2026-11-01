import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateAccessToken = (payload: object): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: object): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
};
