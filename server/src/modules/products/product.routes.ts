import { Router } from "express";
import * as productController from "./product.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createProductSchema, updateProductSchema, generateDescriptionSchema } from "./product.schema.js";
import { authenticateAdmin } from "../../middleware/authenticateAdmin.js";
import { upload } from "../../middleware/upload.js";
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

// IMPORTANT: upload-image MUST come before /:id to avoid route collision
productAdminRoutes.post("/upload-image", upload.single("image"), productController.uploadProductImage);
productAdminRoutes.post("/generate-description", validateRequest({ body: generateDescriptionSchema }), productController.generateDescription);

// Get single product by ID (for edit page)
productAdminRoutes.get("/:id", validateRequest({ params: mongoIdSchema }), productController.getAdminProductById);

productAdminRoutes.post("/", validateRequest({ body: createProductSchema }), productController.createProduct);
productAdminRoutes.patch("/:id", validateRequest({ params: mongoIdSchema, body: updateProductSchema }), productController.updateProduct);
productAdminRoutes.delete("/:id", validateRequest({ params: mongoIdSchema }), productController.deleteProduct);
