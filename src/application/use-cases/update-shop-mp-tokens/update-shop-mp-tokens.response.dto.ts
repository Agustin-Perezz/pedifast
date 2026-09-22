import type { Shop } from "@/domain/entities/shop.entity";

export type UpdateShopMpTokensResponseDto = {
  readonly shop: Shop | null;
};
