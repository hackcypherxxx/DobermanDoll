import { z } from "zod";

export const createOrderSchema = z.object({
  customer: z.object({ name: z.string().min(2), email: z.email(), phone: z.string().min(7) }),
  shippingAddress: z.object({ country: z.string().min(2), stateOrRegion: z.string().min(2), city: z.string().min(2), addressLine1: z.string().min(3), addressLine2: z.string().optional(), postalCode: z.string().min(3) }),
  items: z.array(z.object({ productId: z.string().regex(/^[0-9a-fA-F]{24}$/), quantity: z.number().int().positive() })).min(1),
  couponCode: z.string().optional(),
  preferredPaymentMethod: z.string().optional(), // <--- ADDED
  customerNotes: z.string().optional(),
});

export const paymentInstructionsSchema = z.object({
  paymentMethod: z.string().min(2),
  paymentInstructions: z.string().min(10),
});

export const confirmPaymentSchema = z.object({
  paymentReference: z.string().optional(),
});

export const shipOrderSchema = z.object({
  carrier: z.string().min(2),
  trackingNumber: z.string().min(2),
  trackingUrl: z.url().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type PaymentInstructionsInput = z.infer<typeof paymentInstructionsSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
export type ShipOrderInput = z.infer<typeof shipOrderSchema>;
