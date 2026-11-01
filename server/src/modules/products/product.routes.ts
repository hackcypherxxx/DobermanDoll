import { Router } from "express";
import * as productController from "./product.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createProductSchema, updateProductSchema, generateDescriptionSchema } from "./product.schema.js";
import { authenticateAdmin } from "../../middleware/authenticateAdmin.js";
import { z } from "zod";

const mongoIdSchema = z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format") });
const slugSchema = z.object({ slug: z.string() });

// Public routes
export const productPublicRoutes = Router();
productPublicRoutes.get("/", productController.getPublicProducts);
productPublicRoutes.get("/:slug", validateRequest({ params: slugSchema }), productController.getProductBySlug);

// Admin routes
export const productAdminRoutes = Router();
productAdminRoutes.use(authenticateAdmin);
productAdminRoutes.get("/", productController.getAdminProducts);

// AI Generator Route
productAdminRoutes.post("/generate-description", validateRequest({ body: generateDescriptionSchema }), productController.generateDescription);

productAdminRoutes.post("/", validateRequest({ body: createProductSchema }), productController.createProduct);
productAdminRoutes.patch("/:id", validateRequest({ params: mongoIdSchema, body: updateProductSchema }), productController.updateProduct);
productAdminRoutes.delete("/:id", validateRequest({ params: mongoIdSchema }), productController.deleteProduct);
