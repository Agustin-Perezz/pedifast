import { z } from "zod";

export const getShopCatalogRequestDto = z.object({
  shopName: z.string().min(1),
});

export type GetShopCatalogRequestDto = z.infer<typeof getShopCatalogRequestDto>;
