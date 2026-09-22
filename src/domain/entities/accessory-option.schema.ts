import { z } from "zod";

export const accessoryOptionSchema = z.object({
  id: z.number().int().nonnegative(),
  groupId: z.number().int().positive(),
  name: z.string().min(1),
  priceDelta: z.number().default(0),
  sortOrder: z.number().int().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AccessoryOptionSchema = z.infer<typeof accessoryOptionSchema>;
