import { describe, expect, it } from "vitest";
import { InvalidOrderError } from "./errors";
import { ShopItem } from "./shop-item.entity";
import { ShopItemCategory } from "./shop-item-category.enum";

const CREATED_AT = "2026-01-01T00:00:00.000Z";
const UPDATED_AT = "2026-01-02T00:00:00.000Z";

function makeValidInput(): Parameters<typeof ShopItem.create>[0] {
  return {
    shopId: 2,
    name: "Pizza Margherita",
    price: 1500,
    category: ShopItemCategory.Pizzas,
    images: [],
    description: null,
  };
}

describe("ShopItem", () => {
  it("stamps fresh id and timestamps when not provided", () => {
    const before = new Date().toISOString();

    const item = ShopItem.create(makeValidInput());

    const after = new Date().toISOString();

    expect(item.id).toBe(0);
    expect(item.createdAt >= before).toBe(true);
    expect(item.createdAt <= after).toBe(true);
    expect(item.updatedAt >= before).toBe(true);
    expect(item.updatedAt <= after).toBe(true);
  });

  it("keeps explicit id, images, description and timestamps when provided", () => {
    const item = ShopItem.create({
      id: 11,
      shopId: 2,
      name: "Pizza Margherita",
      price: 1500,
      category: ShopItemCategory.Pizzas,
      images: ["pizza-front.webp"],
      description: "Tomate, mozzarella y albahaca",
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(item.id).toBe(11);
    expect(item.images).toEqual(["pizza-front.webp"]);
    expect(item.description).toBe("Tomate, mozzarella y albahaca");
    expect(item.createdAt).toBe(CREATED_AT);
    expect(item.updatedAt).toBe(UPDATED_AT);
  });

  it("rejects a negative price", () => {
    expect(() => ShopItem.create({ ...makeValidInput(), price: -1 })).toThrow(
      InvalidOrderError,
    );
  });

  it("rejects an empty name", () => {
    expect(() => ShopItem.create({ ...makeValidInput(), name: "" })).toThrow(
      InvalidOrderError,
    );
  });

  it("rejects a shop item without a category", () => {
    expect(() =>
      ShopItem.create({
        ...makeValidInput(),
        category: undefined as unknown as ShopItemCategory,
      }),
    ).toThrow(InvalidOrderError);
  });

  it("exposes an immutable copy of its props through toObject", () => {
    const item = ShopItem.create({
      ...makeValidInput(),
      images: ["pizza-front.webp"],
    });

    const props = item.toObject();

    expect(props).toMatchObject({
      id: 0,
      shopId: 2,
      name: "Pizza Margherita",
      price: 1500,
      category: ShopItemCategory.Pizzas,
      description: null,
    });
    expect(props.images).toEqual(["pizza-front.webp"]);
    expect(props).not.toBe(item["props" as keyof ShopItem]);
  });
});
