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

// GET /api/v1/reviews — All approved reviews (for testimonials page)
const getAllApprovedReviews = asyncHandler(async (req, res) => {
  const { productId, limit } = req.query;

  const filter: any = { isApproved: true };
  if (productId) filter.productId = productId;

  let query = Review.find(filter)
    .populate("productId", "name slug images")
    .sort({ createdAt: -1 });

  if (limit) query = query.limit(Number(limit));

  const reviews = await query;

  // Compute aggregate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  res.status(200).json({
    success: true,
    message: "Reviews retrieved",
    data: reviews,
    meta: { totalReviews, averageRating: Math.round(averageRating * 10) / 10 },
  });
});

// GET /api/v1/reviews/product/:productId — Reviews for a specific product
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId, isApproved: true })
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, message: "Reviews retrieved", data: reviews });
});

// POST /api/v1/reviews — Submit a new review
const submitReview = asyncHandler(async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json({ success: true, message: "Review submitted for approval", data: review });
});

// Admin: GET all reviews (including unapproved)
const getAdminReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find().populate("productId", "name").sort({ createdAt: -1 });
  res.status(200).json({ success: true, message: "All reviews retrieved", data: reviews });
});

// Admin: Approve a review
const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
  res.status(200).json({ success: true, message: "Review approved", data: review });
});

// Admin: Delete a review
const deleteReview = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Review deleted", data: {} });
});

// Public routes
export const reviewPublicRoutes = Router();
reviewPublicRoutes.get("/", getAllApprovedReviews);                     // NEW
reviewPublicRoutes.get("/product/:productId", getProductReviews);
reviewPublicRoutes.post("/", validateRequest({ body: createReviewSchema }), submitReview);

// Admin routes
export const reviewAdminRoutes = Router();
reviewAdminRoutes.use(authenticateAdmin);
reviewAdminRoutes.get("/", getAdminReviews);
reviewAdminRoutes.patch("/:id/approve", approveReview);
reviewAdminRoutes.delete("/:id", deleteReview);
