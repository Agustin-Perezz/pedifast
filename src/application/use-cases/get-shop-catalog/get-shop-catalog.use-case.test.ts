import { describe, expect, it, vi } from "vitest";
import { OrderFlow } from "@/domain/entities/order-flow.enum";
import { Shop } from "@/domain/entities/shop.entity";
import { ShopItem } from "@/domain/entities/shop-item.entity";
import { ShopItemCategory } from "@/domain/entities/shop-item-category.enum";
import type { GetShopCatalogRepository } from "./get-shop-catalog.repository.interface";
import { GetShopCatalogUseCase } from "./get-shop-catalog.use-case";

function makeShop(overrides: Partial<Shop> = {}): Shop {
  return Shop.create({
    id: overrides.id ?? 1,
    shopName: overrides.shopName ?? "pizzeria-luca",
    address: overrides.address ?? "Av. San Martin 123",
    deliveryPrice: overrides.deliveryPrice ?? null,
    whatsappPhone: overrides.whatsappPhone ?? "+5491234567890",
    displayName: overrides.displayName ?? null,
    logoUrl: overrides.logoUrl ?? null,
    portraitUrl: overrides.portraitUrl ?? null,
    openHours: overrides.openHours ?? null,
    lat: overrides.lat ?? 0,
    lng: overrides.lng ?? 0,
    pricePerKm: overrides.pricePerKm ?? 0,
    orderFlow: overrides.orderFlow ?? OrderFlow.Whatsapp,
    dashboardPinHash: overrides.dashboardPinHash ?? null,
    createdAt: overrides.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-01-01T00:00:00.000Z",
  });
}

function makeItem(overrides: Partial<ShopItem> = {}): ShopItem {
  return ShopItem.create({
    id: overrides.id ?? 1,
    shopId: overrides.shopId ?? 1,
    name: overrides.name ?? "Pizza Margherita",
    price: overrides.price ?? 1500,
    category: overrides.category ?? ShopItemCategory.Pizzas,
    images: [...(overrides.images ?? [])],
    description: overrides.description ?? null,
    createdAt: overrides.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-01-01T00:00:00.000Z",
  });
}

describe("GetShopCatalogUseCase", () => {
  it("returns the catalog provided by the repository", async () => {
    const shop = makeShop();
    const item = makeItem();
    const catalog = {
      shop,
      items: [{ item, accessoryGroups: [] }],
    };
    const repository: GetShopCatalogRepository = {
      findByShopName: vi.fn().mockResolvedValue(catalog),
    };
    const useCase = new GetShopCatalogUseCase(repository);

    const result = await useCase.execute({ shopName: "pizzeria-luca" });

    expect(repository.findByShopName).toHaveBeenCalledWith("pizzeria-luca");
    expect(result.catalog).toEqual(catalog);
  });

  it("throws ShopNotFoundError when the repository returns null", async () => {
    const repository: GetShopCatalogRepository = {
      findByShopName: vi.fn().mockResolvedValue(null),
    };
    const useCase = new GetShopCatalogUseCase(repository);

    await expect(useCase.execute({ shopName: "missing-shop" })).rejects.toThrow(
      'Shop with name "missing-shop" was not found',
    );
  });
});
