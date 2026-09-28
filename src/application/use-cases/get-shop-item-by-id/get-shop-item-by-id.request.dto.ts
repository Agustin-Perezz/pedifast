import { z } from "zod";

export const getShopItemByIdRequestDto = z.object({
  itemId: z.number().int().positive(),
});

export type GetShopItemByIdRequestDto = z.infer<
  typeof getShopItemByIdRequestDto
>;
