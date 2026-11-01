import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { productService } from "./product.service.js";
import { geminiService } from "../../services/gemini.service.js";

export const getPublicProducts = asyncHandler(async (req: Request, res: Response) => {
  const data = await productService.getAllPublic(req.query);
  res.status(200).json({ success: true, message: "Products retrieved", data });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const data = await productService.getBySlug(req.params.slug as string);
  res.status(200).json({ success: true, message: "Product retrieved", data });
});

export const getAdminProducts = asyncHandler(async (_req: Request, res: Response) => {
  const data = await productService.getAllAdmin();
  res.status(200).json({ success: true, message: "Products retrieved", data });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = await productService.create(req.body);
  res.status(201).json({ success: true, message: "Product created", data });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = await productService.update(req.params.id as string, req.body);
  res.status(200).json({ success: true, message: "Product updated", data });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.delete(req.params.id as string);
  res.status(200).json({ success: true, message: "Product deleted", data: {} });
});

// AI Description Generator
export const generateDescription = asyncHandler(async (req: Request, res: Response) => {
  const { name, shortDescription, imageUrl } = req.body;
  const htmlDescription = await geminiService.generateProductDescription(name, shortDescription, imageUrl);
  
  res.status(200).json({ 
    success: true, 
    message: "Description generated successfully", 
    data: { description: htmlDescription } 
  });
});
