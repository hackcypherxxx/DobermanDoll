import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { orderService } from "./order.service.js";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { order, trackingToken } = await orderService.createGuestOrder(req.body);
  res.status(201).json({ success: true, message: "Order created successfully", data: { order, trackingToken } });
});
export const getAdminOrders = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Orders retrieved", data: await orderService.getAllAdmin() });
});
export const getAdminOrderById = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Order retrieved", data: await orderService.getByIdAdmin(req.params.id as string) });
});
export const trackOrder = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Tracking retrieved", data: await orderService.trackByToken(req.params.token as string) });
});
export const sendPaymentInstructions = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Instructions sent", data: await orderService.sendPaymentInstructions(req.params.id as string, req.body) });
});
export const confirmPayment = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Payment confirmed", data: await orderService.confirmPayment(req.params.id as string, req.admin!.id, req.body) });
});
export const shipOrder = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Order shipped", data: await orderService.shipOrder(req.params.id as string, req.body) });
});
export const deliverOrder = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Order delivered", data: await orderService.deliverOrder(req.params.id as string) });
});
export const resendReceipt = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Receipt resent", data: await orderService.resendReceipt(req.params.id as string) });
});
export const sendCustomMessage = asyncHandler(async (req: Request, res: Response) => {
  const data = await orderService.sendCustomMessage(req.params.id as string, req.admin!.name, req.body.message);
  res.status(200).json({ success: true, message: "Message sent to customer", data });
});
