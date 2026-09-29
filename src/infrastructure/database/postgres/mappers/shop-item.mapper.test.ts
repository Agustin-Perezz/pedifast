import { describe, expect, it } from "vitest";
import { ShopItemCategory } from "@/domain/entities/shop-item-category.enum";
import type { ShopItemRow } from "../entities/shop-item.entity";
import { shopItemMapper } from "./shop-item.mapper";

const row: ShopItemRow = {
  id: 11,
  shop_id: 2,
  name: "Pizza Margherita",
  price: 1500,
  category: "pizzas",
  images: ["pizza-front.webp", "pizza-side.webp"],
  description: "Tomate, mozzarella y albahaca",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-02T00:00:00.000Z",
};

const CREATED_AT = "2026-01-01T00:00:00.000Z";
const UPDATED_AT = "2026-01-02T00:00:00.000Z";

describe("shopItemMapper", () => {
  it("maps a persistence row to a domain ShopItem with typed category and images", () => {
    const item = shopItemMapper.toDomain(row);

    expect(item.id).toBe(row.id);
    expect(item.shopId).toBe(row.shop_id);
    expect(item.name).toBe(row.name);
    expect(item.price).toBe(row.price);
    expect(item.category).toBe(ShopItemCategory.Pizzas);
    expect(item.images).toEqual(row.images);
    expect(item.description).toBe(row.description);
    expect(item.createdAt).toBe(CREATED_AT);
    expect(item.updatedAt).toBe(UPDATED_AT);
  });

  it("maps a domain ShopItem back to a persistence insert", () => {
    const item = shopItemMapper.toDomain(row);

    expect(shopItemMapper.toPersistence(item)).toEqual({
      shop_id: row.shop_id,
      name: row.name,
      price: row.price,
      category: row.category,
      images: row.images,
      description: row.description,
      created_at: CREATED_AT,
      updated_at: UPDATED_AT,
    });
  });

  it("copies the images array on persistence so row and domain do not share state", () => {
    const item = shopItemMapper.toDomain(row);

    const inserted = shopItemMapper.toPersistence(item);

    expect(inserted.images).toEqual(item.images);
    expect(inserted.images).not.toBe(item.images);
  });
});
