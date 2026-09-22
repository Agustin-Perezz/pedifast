import { describe, expect, it } from "vitest";
import { AccessoryGroup } from "@/domain/entities/accessory-group.entity";
import type { AccessoryGroupWithOptions } from "@/domain/entities/accessory-group-with-options";
import { AccessoryOption } from "@/domain/entities/accessory-option.entity";
import { AccessorySelectionMode } from "@/domain/entities/accessory-selection-mode.enum";
import { ShopItem } from "@/domain/entities/shop-item.entity";
import { ShopItemCategory } from "@/domain/entities/shop-item-category.enum";

import {
  type CartItem,
  cartReducer,
  getCartTotals,
  getItemQuantity,
  getItemUnitPrice,
  hasItemsWithAccessories,
  hasRequiredGroupsMissing,
} from "./cart-reducer";

const baseProduct = ShopItem.create({
  id: 1,
  shopId: 1,
  name: "Pizza",
  price: 1000,
  category: ShopItemCategory.Pizzas,
  description: null,
});

const accessoryProduct = ShopItem.create({
  id: 2,
  shopId: 1,
  name: "Burger",
  price: 1000,
  category: ShopItemCategory.Hamburguesas,
  description: null,
  accessoryGroups: [
    {
      group: AccessoryGroup.create({
        id: 10,
        shopItemId: 2,
        name: "Cheese",
        selectionMode: AccessorySelectionMode.Single,
        isRequired: true,
        sortOrder: 0,
      }),
      options: [
        AccessoryOption.create({
          id: 100,
          groupId: 10,
          name: "Mozzarella",
          priceDelta: 300,
          sortOrder: 0,
        }),
      ],
    },
  ],
});

describe("cartReducer", () => {
  it("is empty on first visit", () => {
    const state = cartReducer({ items: [] }, { type: "CLEAR_CART" });

    expect(state.items).toHaveLength(0);
  });

  it("does not persist to localStorage or server", () => {
    const addAction = { type: "ADD_ITEM" as const, product: baseProduct };
    const state = cartReducer({ items: [] }, addAction);

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
    const optionA = AccessoryOption.create({
      id: 101,
      groupId: 10,
      name: "A",
      priceDelta: 100,
      sortOrder: 0,
    });
    const optionB = AccessoryOption.create({
      id: 102,
      groupId: 10,
      name: "B",
      priceDelta: 200,
      sortOrder: 0,
    });
    const group = AccessoryGroup.create({
      id: 10,
      shopItemId: 2,
      name: "Topping",
      selectionMode: AccessorySelectionMode.Single,
      isRequired: false,
      sortOrder: 0,
    });

    const afterA = cartReducer(
      {
        items: [
          { product: accessoryProduct, quantity: 1, selectedAccessories: [] },
        ],
      },
      {
        type: "SET_ACCESSORIES",
        itemId: accessoryProduct.id,
        group,
        selectedOptions: [optionA],
      },
    );

    expect(afterA.items[0]?.selectedAccessories).toHaveLength(1);
    expect(afterA.items[0]?.selectedAccessories[0]?.optionId).toBe(101);

    const afterB = cartReducer(afterA, {
      type: "SET_ACCESSORIES",
      itemId: accessoryProduct.id,
      group,
      selectedOptions: [optionB],
    });

    expect(afterB.items[0]?.selectedAccessories).toHaveLength(1);
    expect(afterB.items[0]?.selectedAccessories[0]?.optionId).toBe(102);
  });

  it("multi-select toggles options", () => {
    const optionA = AccessoryOption.create({
      id: 101,
      groupId: 11,
      name: "A",
      priceDelta: 100,
      sortOrder: 0,
    });
    const optionB = AccessoryOption.create({
      id: 102,
      groupId: 11,
      name: "B",
      priceDelta: 200,
      sortOrder: 0,
    });
    const group = AccessoryGroup.create({
      id: 11,
      shopItemId: 2,
      name: "Extras",
      selectionMode: AccessorySelectionMode.Multi,
      isRequired: false,
      sortOrder: 0,
    });

    const afterA = cartReducer(
      {
        items: [
          { product: accessoryProduct, quantity: 1, selectedAccessories: [] },
        ],
      },
      {
        type: "SET_ACCESSORIES",
        itemId: accessoryProduct.id,
        group,
        selectedOptions: [optionA],
      },
    );
    const afterB = cartReducer(afterA, {
      type: "SET_ACCESSORIES",
      itemId: accessoryProduct.id,
      group,
      selectedOptions: [optionA, optionB],
    });
    const afterToggleA = cartReducer(afterB, {
      type: "SET_ACCESSORIES",
      itemId: accessoryProduct.id,
      group,
      selectedOptions: [optionB],
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

    expect(
      hasRequiredGroupsMissing(
        cartItem,
        accessoryProduct.toObject().accessoryGroups ?? [],
      ),
    ).toBe(true);
  });

  it("required group allows continuation when selected", () => {
    const option = AccessoryOption.create({
      id: 100,
      groupId: 10,
      name: "Mozzarella",
      priceDelta: 300,
      sortOrder: 0,
    });
    const group = AccessoryGroup.create({
      id: 10,
      shopItemId: 2,
      name: "Cheese",
      selectionMode: AccessorySelectionMode.Single,
      isRequired: true,
      sortOrder: 0,
    });

    const state = cartReducer(
      {
        items: [
          { product: accessoryProduct, quantity: 1, selectedAccessories: [] },
        ],
      },
      {
        type: "SET_ACCESSORIES",
        itemId: accessoryProduct.id,
        group,
        selectedOptions: [option],
      },
    );

    const updatedItem = state.items[0];

    expect(updatedItem).toBeDefined();
    expect(
      hasRequiredGroupsMissing(
        updatedItem,
        accessoryProduct.toObject().accessoryGroups ?? [],
      ),
    ).toBe(false);
  });

  it("detects items with accessories", () => {
    const map = new Map<number, readonly AccessoryGroupWithOptions[]>();

    map.set(
      accessoryProduct.id,
      accessoryProduct.toObject().accessoryGroups ?? [],
    );

    expect(
      hasItemsWithAccessories(
        [{ product: accessoryProduct, quantity: 1, selectedAccessories: [] }],
        map,
      ),
    ).toBe(true);
  });

  it("returns zero quantity for an absent item", () => {
    expect(getItemQuantity([], 999)).toBe(0);
  });
});
