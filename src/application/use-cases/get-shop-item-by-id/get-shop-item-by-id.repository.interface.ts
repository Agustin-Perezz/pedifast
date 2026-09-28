import type { AccessoryGroupWithOptions } from "@/domain/entities/accessory-group-with-options";
import type { ShopItem } from "@/domain/entities/shop-item.entity";

export type ShopItemWithAccessories = {
  readonly item: ShopItem;
  readonly accessoryGroups: readonly AccessoryGroupWithOptions[];
};

export interface GetShopItemByIdRepository {
  findById(itemId: number): Promise<ShopItemWithAccessories | null>;
}
