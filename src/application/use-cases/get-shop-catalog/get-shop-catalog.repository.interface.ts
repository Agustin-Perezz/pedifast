import type { ShopCatalog } from "./get-shop-catalog.response.dto";

export interface GetShopCatalogRepository {
  findByShopName(shopName: string): Promise<ShopCatalog | null>;
}
