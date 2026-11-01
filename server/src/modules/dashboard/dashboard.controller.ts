import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Order } from "../orders/order.model.js";
import { Product } from "../products/product.model.js";

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  
  const revenueResult = await Order.aggregate([
    { $match: { paymentStatus: "PAID" } },
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).select("orderNumber total orderStatus");

  res.status(200).json({
    success: true,
    message: "Stats retrieved",
    data: { totalOrders, totalProducts, totalRevenue, recentOrders },
  });
});
