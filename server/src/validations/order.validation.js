import { z } from "zod";

export const createOrderSchema =
  z.object({
    paymentMethod: z.enum([
      "COD",
      "RAZORPAY",
      "STRIPE",
    ]),

    shippingAddress: z.object({
      fullName: z.string(),

      phone: z.string(),

      addressLine: z.string(),

      city: z.string(),

      state: z.string(),

      postalCode: z.string(),

      country: z.string(),
    }),
  });