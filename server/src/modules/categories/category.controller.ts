import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { categoryService } from "./category.service.js";

export const getPublicCategories = asyncHandler(async (_req: Request, res: Response) => {
  const data = await categoryService.getAllPublic();
  res.status(200).json({ success: true, message: "Categories retrieved", data });
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const data = await categoryService.getBySlug(req.params.slug as string);
  res.status(200).json({ success: true, message: "Category retrieved", data });
});

export const getAdminCategories = asyncHandler(async (_req: Request, res: Response) => {
  const data = await categoryService.getAllAdmin();
  res.status(200).json({ success: true, message: "Categories retrieved", data });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await categoryService.create(req.body);
  res.status(201).json({ success: true, message: "Category created", data });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await categoryService.update(req.params.id as string, req.body);
  res.status(200).json({ success: true, message: "Category updated", data });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoryService.delete(req.params.id as string);
  res.status(200).json({ success: true, message: "Category deleted", data: {} });
});
