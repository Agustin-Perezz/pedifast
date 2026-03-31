import type {
  ShopMpOAuthTokensUpdate,
  ShopMpTokensUpdate
} from '$domain/models/shop';

import type { AccessoryGroupsRepository } from '$lib/server/repositories/accessory-groups.repository';
import type { ShopItemsRepository } from '$lib/server/repositories/shop-items.repository';
import type { ShopsRepository } from '$lib/server/repositories/shops.repository';

export class ShopsService {
  constructor(
    private readonly shopsRepo: ShopsRepository,
    private readonly accessoryGroupsRepo: AccessoryGroupsRepository,
    private readonly shopItemsRepo: ShopItemsRepository
  ) {}

  async getShopWithProducts(shopName: string) {
    const result = await this.shopsRepo.getShopWithItems(shopName);
    if (!result) {
      return null;
    }

    const { shop, products } = result;

    const itemIds = products.map((p) => Number(p.id));
    const accessoryMap = await this.accessoryGroupsRepo.getByItemIds(itemIds);

    const enrichedProducts = products.map((p) => ({
      ...p,
      accessoryGroups: accessoryMap.get(Number(p.id))
    }));

    return { shop, products: enrichedProducts };
  }

  async getProductDetail(shopName: string, productId: number) {
    const [shop, result] = await Promise.all([
      this.shopsRepo.getShopId(shopName),
      this.shopItemsRepo.getItemWithAccessories(productId)
    ]);

    if (!shop) {
      return { error: 'shop_not_found' as const };
    }
    if (!result) {
      return { error: 'product_not_found' as const };
    }
    if (result.shopId !== shop.id) {
      return { error: 'product_not_found' as const };
    }

    return { product: result.product };
  }

  async getShopMeta(shopName: string) {
    return this.shopsRepo.getShopMeta(shopName);
  }

  async getMpTokens(shopName: string) {
    return this.shopsRepo.getMpTokens(shopName);
  }

  async updateMpTokens(shopName: string, tokens: ShopMpTokensUpdate) {
    return this.shopsRepo.updateMpTokens(shopName, tokens);
  }

  async updateMpOAuthTokens(shopName: string, tokens: ShopMpOAuthTokensUpdate) {
    return this.shopsRepo.updateMpOAuthTokens(shopName, tokens);
  }
}
