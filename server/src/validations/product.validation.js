import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(3),

  description: z.string().min(10),

  category: z.string(),

  price: z.number(),

  stock: z.number(),
});

export const updateProductSchema =
  createProductSchema.partial();