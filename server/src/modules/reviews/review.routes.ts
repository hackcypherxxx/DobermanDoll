import { Router } from "express";
import { z } from "zod";
import { Review } from "./review.model.js";
import { authenticateAdmin } from "../../middleware/authenticateAdmin.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const createReviewSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  customerName: z.string().min(2),
  customerEmail: z.email(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5),
});

// Controllers
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId, isApproved: true }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, message: "Reviews retrieved", data: reviews });
});

const submitReview = asyncHandler(async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json({ success: true, message: "Review submitted for approval", data: review });
});

const getAdminReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find().populate("productId", "name").sort({ createdAt: -1 });
  res.status(200).json({ success: true, message: "All reviews retrieved", data: reviews });
});

const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  res.status(200).json({ success: true, message: "Review approved", data: review });
});

const deleteReview = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Review deleted", data: {} });
});

// Routes
export const reviewPublicRoutes = Router();
reviewPublicRoutes.get("/product/:productId", getProductReviews);
reviewPublicRoutes.post("/", validateRequest({ body: createReviewSchema }), submitReview);

export const reviewAdminRoutes = Router();
reviewAdminRoutes.use(authenticateAdmin);
reviewAdminRoutes.get("/", getAdminReviews);
reviewAdminRoutes.patch("/:id/approve", approveReview);
reviewAdminRoutes.delete("/:id", deleteReview);
