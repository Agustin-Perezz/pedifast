import { z } from "zod";
import type { AccessoryGroupWithOptions } from "./accessory-group-with-options";
import { ShopItemCategory } from "./shop-item-category.enum";

export const shopItemSchema = z.object({
  id: z.number().int().nonnegative(),
  shopId: z.number().int().positive(),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  category: z.enum(ShopItemCategory),
  images: z.array(z.string()).default(() => []),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  accessoryGroups: z
    .array(
      z.custom<AccessoryGroupWithOptions>((value) => {
        return (
          typeof value === "object" &&
          value !== null &&
          "group" in value &&
          "options" in value &&
          Array.isArray(value.options)
        );
      }),
    )
    .default(() => []),
});

export type ShopItemSchema = Omit<
  z.infer<typeof shopItemSchema>,
  "accessoryGroups"
> & {
  accessoryGroups?: readonly AccessoryGroupWithOptions[];
};
