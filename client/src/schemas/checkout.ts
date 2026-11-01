import { z } from "zod";

export const checkoutSchema = z.object({
  customer: z.object({
    name: z
      .string()
      .min(2, "Please enter your full name")
      .max(100, "Name is too long"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(200, "Email is too long"),
    phone: z
      .string()
      .min(5, "Please enter a valid phone number")
      .max(30, "Phone number is too long"),
  }),
  shippingAddress: z.object({
    country: z.string().min(2, "Country is required").max(100),
    stateOrRegion: z.string().min(1, "State or region is required").max(100),
    city: z.string().min(1, "City is required").max(100),
    addressLine1: z.string().min(1, "Address is required").max(200),
    addressLine2: z.string().max(200).optional(),
    postalCode: z.string().min(1, "Postal code is required").max(20),
  }),
  customerNotes: z.string().max(1000, "Notes are too long").optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
