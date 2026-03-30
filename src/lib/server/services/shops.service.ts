import type {
  AccessoryGroupsRepository,
  RawAccessoryGroup
} from '$lib/server/repositories/accessory-groups.repository';
import type { ShopItemsRepository } from '$lib/server/repositories/shop-items.repository';
import type { ShopsRepository } from '$lib/server/repositories/shops.repository';
import {
  ShopItemCategory,
  type AccessoryGroup,
  type AccessorySelectionMode,
  type Product
} from '$lib/types/product';
import type {
  ShopMpOAuthTokensUpdate,
  ShopMpTokensUpdate
} from '$lib/types/shop';

export class ShopsService {
  constructor(
    private readonly shopsRepo: ShopsRepository,
    private readonly accessoryGroupsRepo: AccessoryGroupsRepository,
    private readonly shopItemsRepo: ShopItemsRepository
  ) {}

  async getShopWithProducts(shopName: string) {
    const shopData = await this.shopsRepo.getShopWithItems(shopName);
    if (!shopData) {
      return null;
    }

    const itemIds = (shopData.shop_items ?? []).map((item) => {
      return item.id;
    });

    const accessoryRows = await this.accessoryGroupsRepo.getByItemIds(itemIds);

    const accessoryMap = new Map<number, RawAccessoryGroup[]>();
    for (const group of accessoryRows) {
      const existing = accessoryMap.get(group.shop_item_id) ?? [];
      existing.push({
        id: group.id,
        name: group.name,
        selection_mode: group.selection_mode,
        is_required: group.is_required,
        sort_order: group.sort_order,
        accessory_options: group.accessory_options ?? []
      });
      accessoryMap.set(group.shop_item_id, existing);
    }

    const products: Product[] = [...(shopData.shop_items ?? [])]
      .sort((a, b) => a.id - b.id)
      .map((item) => ({
        id: String(item.id),
        name: item.name,
        price: Number(item.price),
        images: item.images as string[],
        category: item.category as ShopItemCategory,
        description: (item.description as string | null) ?? undefined,
        accessoryGroups: this.mapAccessoryGroups(
          accessoryMap.get(item.id) ?? null
        )
      }));

    return {
      shop: {
        address: shopData.address ?? null,
        deliveryPrice:
          shopData.delivery_price != null
            ? Number(shopData.delivery_price)
            : null,
        whatsappPhone: shopData.whatsapp_phone,
        displayName: shopData.display_name ?? null,
        logoUrl: shopData.logo_url ?? null,
        portraitUrl: shopData.portrait_url ?? null,
        openHours: shopData.open_hours ?? null,
        lat: Number(shopData.lat),
        lng: Number(shopData.lng),
        pricePerKm: Number(shopData.price_per_km)
      },
      products
    };
  }

  async getProductDetail(shopName: string, productId: number) {
    const [shop, item] = await Promise.all([
      this.shopsRepo.getShopId(shopName),
      this.shopItemsRepo.getItemWithAccessories(productId)
    ]);

    if (!shop) {
      return { error: 'shop_not_found' as const };
    }
    if (!item) {
      return { error: 'product_not_found' as const };
    }
    if (item.shop_id !== shop.id) {
      return { error: 'product_not_found' as const };
    }

    const validCategories = Object.values(ShopItemCategory);
    if (!validCategories.includes(item.category as ShopItemCategory)) {
      return { error: 'invalid_category' as const };
    }

    const product: Product = {
      id: String(item.id),
      name: item.name,
      price: Number(item.price),
      images: item.images as string[],
      category: item.category as ShopItemCategory,
      description: (item.description as string | null) ?? undefined,
      accessoryGroups: this.mapAccessoryGroups(
        (item as Record<string, unknown>).accessory_groups as
          | RawAccessoryGroup[]
          | null
      )
    };

    return { product };
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

  private mapAccessoryGroups(
    raw: RawAccessoryGroup[] | null
  ): AccessoryGroup[] | undefined {
    if (!raw || raw.length === 0) {
      return undefined;
    }
    return [...raw]
      .sort((a, b) => {
        return a.sort_order - b.sort_order;
      })
      .map((g) => ({
        id: g.id,
        name: g.name,
        selectionMode: g.selection_mode as AccessorySelectionMode,
        isRequired: g.is_required,
        options: [...g.accessory_options]
          .sort((a, b) => {
            return a.sort_order - b.sort_order;
          })
          .map((o) => ({
            id: o.id,
            name: o.name,
            priceDelta: Number(o.price_delta)
          }))
      }));
  }
}
