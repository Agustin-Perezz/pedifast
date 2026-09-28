import type { AccessoryGroupWithOptions } from "@/domain/entities/accessory-group-with-options";
import type { Shop } from "@/domain/entities/shop.entity";
import type { ShopItem } from "@/domain/entities/shop-item.entity";

export type CatalogItem = {
  readonly item: ShopItem;
  readonly accessoryGroups: readonly AccessoryGroupWithOptions[];
};

export type ShopCatalog = {
  readonly shop: Shop;
  readonly items: readonly CatalogItem[];
};

export type GetShopCatalogResponseDto = {
  readonly catalog: ShopCatalog | null;
};
