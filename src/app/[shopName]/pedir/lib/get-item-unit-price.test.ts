import { describe, expect, it } from "vitest";

import type { CartItem } from "./cart-reducer";
import { getItemUnitPrice } from "./cart-reducer";

type BuildItemInput = {
  readonly productId?: number;
  readonly basePrice?: number;
  readonly quantity?: number;
  readonly accessories?: CartItem["selectedAccessories"];
};

function buildItem({
  productId = 1,
  basePrice = 1000,
  quantity = 1,
  accessories = [],
}: BuildItemInput = {}): CartItem {
  return {
    product: {
      id: productId,
      name: "Pizza Margherita",
      price: basePrice,
    },
    quantity,
    selectedAccessories: accessories,
  };
}

describe("getItemUnitPrice", () => {
  it("returns the base price when the item has no accessories", () => {
    expect(getItemUnitPrice(buildItem({ basePrice: 1250 }))).toBe(1250);
  });

  it("includes accessory price deltas in the unit price", () => {
    const item = buildItem({
      basePrice: 1000,
      accessories: [
        { optionId: 1, groupId: 10, name: "Mozzarella extra", priceDelta: 300 },
        { optionId: 2, groupId: 20, name: "Aceitunas", priceDelta: 150 },
      ],
    });

    expect(getItemUnitPrice(item)).toBe(1450);
  });

  it("does not change the unit price when deltas are zero", () => {
    const item = buildItem({
      basePrice: 1000,
      accessories: [
        { optionId: 1, groupId: 10, name: "Sin sal", priceDelta: 0 },
      ],
    });

    expect(getItemUnitPrice(item)).toBe(1000);
  });
});
