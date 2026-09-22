import type { ShopItemWithAccessories } from "./get-shop-item-by-id.repository.interface";

export type GetShopItemByIdResponseDto = {
  readonly shopItem: ShopItemWithAccessories | null;
};
