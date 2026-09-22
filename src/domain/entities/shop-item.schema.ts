import { z } from "zod";
import { ShopItemCategory } from "./shop-item-category.enum";

export const shopItemSchema = z.object({
  id: z.number().int().nonnegative(),
  shopId: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  category: z.nativeEnum(ShopItemCategory),
  images: z.array(z.string()).default(() => []),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ShopItemSchema = z.infer<typeof shopItemSchema>;
