import { describe, expect, it } from "vitest";

import type { PlainAccessoryGroup } from "../lib/serialize-catalog";
import {
  type CartItem,
  type CartProduct,
  cartReducer,
  getCartTotals,
  getItemQuantity,
  getItemUnitPrice,
  hasItemsWithAccessories,
  hasRequiredGroupsMissing,
} from "./cart-reducer";

const baseProduct: CartProduct = {
  id: 1,
  name: "Pizza",
  price: 1000,
};

const singleGroup: PlainAccessoryGroup = {
  id: 10,
  name: "Cheese",
  selectionMode: "single",
  isRequired: true,
  options: [
    { id: 100, name: "Mozzarella", priceDelta: 300, sortOrder: 0 },
    { id: 101, name: "A", priceDelta: 100, sortOrder: 1 },
    { id: 102, name: "B", priceDelta: 200, sortOrder: 2 },
  ],
};

const multiGroup: PlainAccessoryGroup = {
  id: 11,
  name: "Extras",
  selectionMode: "multi",
  isRequired: false,
  options: [
    { id: 101, name: "A", priceDelta: 100, sortOrder: 0 },
    { id: 102, name: "B", priceDelta: 200, sortOrder: 1 },
  ],
};

const accessoryProduct: CartProduct = {
  id: 2,
  name: "Burger",
  price: 1000,
};

describe("cartReducer", () => {
  it("is empty on first visit", () => {
    const state = cartReducer({ items: [] }, { type: "CLEAR_CART" });

    expect(state.items).toHaveLength(0);
  });

  it("does not persist to localStorage or server", () => {
    const state = cartReducer(
      { items: [] },
      { type: "ADD_ITEM", product: baseProduct },
    );

    expect(state.items).toHaveLength(1);

    const reloadState = cartReducer({ items: [] }, { type: "CLEAR_CART" });

    expect(reloadState.items).toHaveLength(0);
  });

  it("adds a new product", () => {
    const state = cartReducer(
      { items: [] },
      { type: "ADD_ITEM", product: baseProduct },
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(1);
    expect(state.items[0]?.selectedAccessories).toHaveLength(0);
  });

  it("increments quantity for an existing product", () => {
    const first = cartReducer(
      { items: [] },
      { type: "ADD_ITEM", product: baseProduct },
    );
    const second = cartReducer(first, {
      type: "ADD_ITEM",
      product: baseProduct,
    });

    expect(second.items).toHaveLength(1);
    expect(second.items[0]?.quantity).toBe(2);
  });

  it("removes the item when quantity reaches zero", () => {
    const state = cartReducer(
      {
        items: [{ product: baseProduct, quantity: 1, selectedAccessories: [] }],
      },
      { type: "REMOVE_ITEM", itemId: baseProduct.id },
    );

    expect(state.items).toHaveLength(0);
  });

  it("decrements quantity when above one", () => {
    const state = cartReducer(
      {
        items: [{ product: baseProduct, quantity: 2, selectedAccessories: [] }],
      },
      { type: "REMOVE_ITEM", itemId: baseProduct.id },
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]?.quantity).toBe(1);
  });

  it("computes unit price including accessory deltas", () => {
    const cartItem: CartItem = {
      product: baseProduct,
      quantity: 1,
      selectedAccessories: [
        { optionId: 100, groupId: 10, name: "Mozzarella", priceDelta: 300 },
      ],
    };

    expect(getItemUnitPrice(cartItem)).toBe(1300);
  });

  it("computes cart totals", () => {
    const state = {
      items: [
        { product: baseProduct, quantity: 2, selectedAccessories: [] },
        {
          product: baseProduct,
          quantity: 1,
          selectedAccessories: [
            {
              optionId: 100,
              groupId: 10,
              name: "Mozzarella",
              priceDelta: 300,
            },
          ],
        },
      ],
    };

    expect(getCartTotals(state.items)).toEqual({
      totalItems: 3,
      totalPrice: 3300,
    });
  });

  it("single-select replaces the previous selection", () => {
    const afterA = cartReducer(
      {
        items: [
          { product: accessoryProduct, quantity: 1, selectedAccessories: [] },
        ],
      },
      {
        type: "SET_ACCESSORIES",
        itemId: accessoryProduct.id,
        group: singleGroup,
        selectedOptions: [singleGroup.options[1]],
      },
    );

    expect(afterA.items[0]?.selectedAccessories).toHaveLength(1);
    expect(afterA.items[0]?.selectedAccessories[0]?.optionId).toBe(101);

    const afterB = cartReducer(afterA, {
      type: "SET_ACCESSORIES",
      itemId: accessoryProduct.id,
      group: singleGroup,
      selectedOptions: [singleGroup.options[2]],
    });

    expect(afterB.items[0]?.selectedAccessories).toHaveLength(1);
    expect(afterB.items[0]?.selectedAccessories[0]?.optionId).toBe(102);
  });

  it("multi-select toggles options", () => {
    const afterA = cartReducer(
      {
        items: [
          { product: accessoryProduct, quantity: 1, selectedAccessories: [] },
        ],
      },
      {
        type: "SET_ACCESSORIES",
        itemId: accessoryProduct.id,
        group: multiGroup,
        selectedOptions: [multiGroup.options[0]],
      },
    );
    const afterB = cartReducer(afterA, {
      type: "SET_ACCESSORIES",
      itemId: accessoryProduct.id,
      group: multiGroup,
      selectedOptions: multiGroup.options,
    });
    const afterToggleA = cartReducer(afterB, {
      type: "SET_ACCESSORIES",
      itemId: accessoryProduct.id,
      group: multiGroup,
      selectedOptions: [multiGroup.options[1]],
    });

    expect(afterToggleA.items[0]?.selectedAccessories).toHaveLength(1);
    expect(afterToggleA.items[0]?.selectedAccessories[0]?.optionId).toBe(102);
  });

  it("required group blocks continuation when empty", () => {
    const cartItem: CartItem = {
      product: accessoryProduct,
      quantity: 1,
      selectedAccessories: [],
    };

    expect(hasRequiredGroupsMissing(cartItem, [singleGroup])).toBe(true);
  });

  it("required group allows continuation when selected", () => {
    const state = cartReducer(
      {
        items: [
          { product: accessoryProduct, quantity: 1, selectedAccessories: [] },
        ],
      },
      {
        type: "SET_ACCESSORIES",
        itemId: accessoryProduct.id,
        group: singleGroup,
        selectedOptions: [singleGroup.options[0]],
      },
    );

    const updatedItem = state.items[0];

    expect(updatedItem).toBeDefined();
    expect(hasRequiredGroupsMissing(updatedItem, [singleGroup])).toBe(false);
  });

  it("detects items with accessories", () => {
    const map = new Map<number, readonly PlainAccessoryGroup[]>([
      [accessoryProduct.id, [singleGroup]],
    ]);

    expect(
      hasItemsWithAccessories(
        [
          {
            product: accessoryProduct,
            quantity: 1,
            selectedAccessories: [],
          },
        ],
        map,
      ),
    ).toBe(true);
  });

  it("returns zero quantity for an absent item", () => {
    expect(getItemQuantity([], baseProduct.id)).toBe(0);
  });
});
