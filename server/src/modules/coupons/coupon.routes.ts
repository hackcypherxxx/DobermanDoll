import { Router } from "express";
import { z } from "zod";
import { Coupon } from "./coupon.model.js";
import { authenticateAdmin } from "../../middleware/authenticateAdmin.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";

const createCouponSchema = z.object({
  code: z.string().min(3),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive(),
  minPurchaseAmount: z.number().min(0).default(0),
  maxUses: z.number().positive().default(1000),
  expiresAt: z.string().transform((str) => new Date(str)),
});

// Controllers
const createCoupon = asyncHandler(async (req, res) => {
  const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
  if (existing) throw new ApiError(409, "Coupon code already exists");
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, message: "Coupon created", data: coupon });
});

const getCoupons = asyncHandler(async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, message: "Coupons retrieved", data: coupons });
});

const validateCouponPublic = asyncHandler(async (req, res) => {
  const code = req.params.code as string;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  
  if (!coupon) throw new ApiError(404, "Invalid coupon code");
  if (coupon.uses >= coupon.maxUses) throw new ApiError(400, "Coupon has reached its usage limit");
  if (new Date() > coupon.expiresAt) throw new ApiError(400, "Coupon has expired");

  res.status(200).json({ success: true, message: "Coupon is valid", data: coupon });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id as string);
  res.status(200).json({ success: true, message: "Coupon deleted", data: {} });
});

// Routes
export const couponPublicRoutes = Router();
couponPublicRoutes.get("/:code", validateCouponPublic);

export const couponAdminRoutes = Router();
couponAdminRoutes.use(authenticateAdmin);
couponAdminRoutes.get("/", getCoupons);
couponAdminRoutes.post("/", validateRequest({ body: createCouponSchema }), createCoupon);
couponAdminRoutes.delete("/:id", deleteCoupon);
