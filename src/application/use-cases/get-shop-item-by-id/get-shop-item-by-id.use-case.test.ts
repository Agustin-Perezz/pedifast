import { describe, expect, it, vi } from "vitest";
import { ShopItem } from "@/domain/entities/shop-item.entity";
import { ShopItemCategory } from "@/domain/entities/shop-item-category.enum";
import type { GetShopItemByIdRepository } from "./get-shop-item-by-id.repository.interface";
import { GetShopItemByIdUseCase } from "./get-shop-item-by-id.use-case";

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

describe("GetShopItemByIdUseCase", () => {
  it("returns the item with accessories provided by the repository", async () => {
    const item = makeItem();
    const repository: GetShopItemByIdRepository = {
      findById: vi.fn().mockResolvedValue({ item, accessoryGroups: [] }),
    };
    const useCase = new GetShopItemByIdUseCase(repository);

    const result = await useCase.execute({ itemId: 1 });

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(result.shopItem?.item).toEqual(item);
  });

  it("returns null when the repository finds no item", async () => {
    const repository: GetShopItemByIdRepository = {
      findById: vi.fn().mockResolvedValue(null),
    };
    const useCase = new GetShopItemByIdUseCase(repository);

    const result = await useCase.execute({ itemId: 999 });

    expect(result.shopItem).toBeNull();
  });
});
