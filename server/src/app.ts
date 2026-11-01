import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import morgan from "morgan";
import { env } from "./config/env.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { categoryPublicRoutes, categoryAdminRoutes } from "./modules/categories/category.routes.js";
import { productPublicRoutes, productAdminRoutes } from "./modules/products/product.routes.js";
import { orderPublicRoutes, orderAdminRoutes } from "./modules/orders/order.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import messageRoutes from "./modules/messages/message.routes.js";
import { couponPublicRoutes, couponAdminRoutes } from "./modules/coupons/coupon.routes.js";
import { reviewPublicRoutes, reviewAdminRoutes } from "./modules/reviews/review.routes.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(hpp());

if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}
app.use(globalLimiter);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ success: true, message: "OK", data: { uptime: process.uptime(), env: env.NODE_ENV } });
});

// Module routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryPublicRoutes);
app.use("/api/v1/products", productPublicRoutes);
app.use("/api/v1/orders", orderPublicRoutes);
app.use("/api/v1/contact", messageRoutes);
app.use("/api/v1/coupons", couponPublicRoutes);
app.use("/api/v1/reviews", reviewPublicRoutes);

app.use("/api/v1/admin/categories", categoryAdminRoutes);
app.use("/api/v1/admin/products", productAdminRoutes);
app.use("/api/v1/admin/orders", orderAdminRoutes);
app.use("/api/v1/admin/dashboard", dashboardRoutes);
app.use("/api/v1/admin/coupons", couponAdminRoutes);
app.use("/api/v1/admin/reviews", reviewAdminRoutes);

app.use(notFound);
app.use(errorHandler);
