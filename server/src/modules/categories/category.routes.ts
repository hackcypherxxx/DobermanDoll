import { Router } from "express";
import * as categoryController from "./category.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createCategorySchema, updateCategorySchema } from "./category.schema.js";
import { authenticateAdmin } from "../../middleware/authenticateAdmin.js";
import { z } from "zod";

const mongoIdSchema = z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format") });
const slugSchema = z.object({ slug: z.string() });

// Public routes
export const categoryPublicRoutes = Router();
categoryPublicRoutes.get("/", categoryController.getPublicCategories);
categoryPublicRoutes.get("/:slug", validateRequest({ params: slugSchema }), categoryController.getCategoryBySlug);

// Admin routes
export const categoryAdminRoutes = Router();
categoryAdminRoutes.use(authenticateAdmin);
categoryAdminRoutes.get("/", categoryController.getAdminCategories);
categoryAdminRoutes.post("/", validateRequest({ body: createCategorySchema }), categoryController.createCategory);
categoryAdminRoutes.patch("/:id", validateRequest({ params: mongoIdSchema, body: updateCategorySchema }), categoryController.updateCategory);
categoryAdminRoutes.delete("/:id", validateRequest({ params: mongoIdSchema }), categoryController.deleteCategory);
