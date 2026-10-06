import { describe, expect, it } from "vitest";

import type { CartItem } from "./cart-reducer";
import { findRequiredGroupMissingInCart } from "./find-required-group-missing-in-cart";
import type { PlainAccessoryGroup } from "./serialize-catalog";

const requiredGroup: PlainAccessoryGroup = {
  id: 10,
  name: "Tamaño",
  selectionMode: "single",
  isRequired: true,
  options: [{ id: 100, name: "Grande", priceDelta: 0, sortOrder: 0 }],
};

const optionalGroup: PlainAccessoryGroup = {
  id: 11,
  name: "Extras",
  selectionMode: "multi",
  isRequired: false,
  options: [{ id: 101, name: "Bacon", priceDelta: 200, sortOrder: 0 }],
};

const itemWithGroups: CartItem = {
  product: { id: 1, name: "Burger", price: 1000 },
  quantity: 1,
  selectedAccessories: [],
};

const itemWithRequiredSelected: CartItem = {
  product: { id: 1, name: "Burger", price: 1000 },
  quantity: 1,
  selectedAccessories: [
    { optionId: 100, groupId: 10, name: "Grande", priceDelta: 0 },
  ],
};

function groupsByItemId(
  groups: readonly PlainAccessoryGroup[],
): ReadonlyMap<number, readonly PlainAccessoryGroup[]> {
  return new Map([[1, groups]]);
}

describe("findRequiredGroupMissingInCart", () => {
  it("returns the item when a required group has no selection", () => {
    const result = findRequiredGroupMissingInCart(
      [itemWithGroups],
      groupsByItemId([requiredGroup, optionalGroup]),
    );

    expect(result).toEqual({ itemId: 1, groupId: 10 });
  });

  it("returns null when all required groups are selected", () => {
    const result = findRequiredGroupMissingInCart(
      [itemWithRequiredSelected],
      groupsByItemId([requiredGroup, optionalGroup]),
    );

    expect(result).toBeNull();
  });

  it("ignores items without groups", () => {
    const result = findRequiredGroupMissingInCart(
      [itemWithGroups],
      groupsByItemId([]),
    );

    expect(result).toBeNull();
  });

  it("ignores unselected optional groups", () => {
    const result = findRequiredGroupMissingInCart(
      [itemWithGroups],
      groupsByItemId([optionalGroup]),
    );

    expect(result).toBeNull();
  });
});
