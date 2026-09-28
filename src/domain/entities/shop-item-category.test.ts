import { describe, expect, it } from "vitest";
import { ShopItemCategory } from "./shop-item-category.enum";

describe("ShopItemCategory", () => {
  it("contains exactly the eight allowed categories", () => {
    const categories = Object.values(ShopItemCategory);

    expect(categories).toHaveLength(8);
    expect(categories).toContain("hamburguesas");
    expect(categories).toContain("pizzas");
    expect(categories).toContain("empanadas");
    expect(categories).toContain("sandwiches");
    expect(categories).toContain("ensaladas");
    expect(categories).toContain("papas");
    expect(categories).toContain("milanesas");
    expect(categories).toContain("bebidas");
  });

  it("is a bounded enum that rejects unrelated values", () => {
    const invalidCategory = "sushi" as ShopItemCategory;

    expect(Object.values(ShopItemCategory)).not.toContain(invalidCategory);
  });
});
