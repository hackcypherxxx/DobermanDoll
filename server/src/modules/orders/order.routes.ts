import { Router } from "express";
import * as orderController from "./order.controller.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { createOrderSchema, paymentInstructionsSchema, confirmPaymentSchema, shipOrderSchema } from "./order.schema.js";
import { authenticateAdmin } from "../../middleware/authenticateAdmin.js";
import { z } from "zod";

const mongoIdSchema = z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/) });
const tokenSchema = z.object({ token: z.string().min(10) });
const messageSchema = z.object({ message: z.string().min(1, "Message cannot be empty") });

export const orderPublicRoutes = Router();
orderPublicRoutes.post("/", validateRequest({ body: createOrderSchema }), orderController.createOrder);
orderPublicRoutes.get("/track/:token", validateRequest({ params: tokenSchema }), orderController.trackOrder);

export const orderAdminRoutes = Router();
orderAdminRoutes.use(authenticateAdmin);
orderAdminRoutes.get("/", orderController.getAdminOrders);
orderAdminRoutes.get("/:id", validateRequest({ params: mongoIdSchema }), orderController.getAdminOrderById);
orderAdminRoutes.post("/:id/payment-instructions", validateRequest({ params: mongoIdSchema, body: paymentInstructionsSchema }), orderController.sendPaymentInstructions);
orderAdminRoutes.post("/:id/confirm-payment", validateRequest({ params: mongoIdSchema, body: confirmPaymentSchema }), orderController.confirmPayment);
orderAdminRoutes.post("/:id/ship", validateRequest({ params: mongoIdSchema, body: shipOrderSchema }), orderController.shipOrder);
orderAdminRoutes.post("/:id/deliver", validateRequest({ params: mongoIdSchema }), orderController.deliverOrder);
orderAdminRoutes.post("/:id/resend-receipt", validateRequest({ params: mongoIdSchema }), orderController.resendReceipt);
orderAdminRoutes.post("/:id/messages", validateRequest({ params: mongoIdSchema, body: messageSchema }), orderController.sendCustomMessage);
