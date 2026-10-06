import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../lib/serialize-catalog";

export type CartProduct = {
  readonly id: number;
  readonly name: string;
  readonly price: number;
};

export type CartItemAccessory = {
  readonly optionId: number;
  readonly groupId: number;
  readonly name: string;
  readonly priceDelta: number;
};

export type CartItem = {
  readonly product: CartProduct;
  readonly quantity: number;
  readonly selectedAccessories: readonly CartItemAccessory[];
};

export type CartState = {
  readonly items: readonly CartItem[];
};

export type CartAction =
  | { type: "ADD_ITEM"; product: CartProduct }
  | { type: "REMOVE_ITEM"; itemId: number }
  | {
      type: "SET_ACCESSORIES";
      itemId: number;
      group: PlainAccessoryGroup;
      selectedOptions: readonly PlainAccessoryOption[];
    }
  | { type: "CLEAR_CART" };

export const addItemAction = (product: CartProduct): CartAction => ({
  type: "ADD_ITEM",
  product,
});

export const removeItemAction = (itemId: number): CartAction => ({
  type: "REMOVE_ITEM",
  itemId,
});

export const clearCartAction = (): CartAction => ({ type: "CLEAR_CART" });

export const setAccessoriesAction = (
  itemId: number,
  group: PlainAccessoryGroup,
  selectedOptions: readonly PlainAccessoryOption[],
): CartAction => ({
  type: "SET_ACCESSORIES",
  itemId,
  group,
  selectedOptions,
});

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (cartItem) => cartItem.product.id === action.product.id,
      );

      if (existingIndex === -1) {
        return {
          items: [
            ...state.items,
            {
              product: action.product,
              quantity: 1,
              selectedAccessories: [],
            },
          ],
        };
      }

      const existing = state.items[existingIndex];
      const nextItems = [...state.items];
      nextItems[existingIndex] = {
        ...existing,
        quantity: existing.quantity + 1,
      };

      return { items: nextItems };
    }

    case "REMOVE_ITEM": {
      const existingIndex = state.items.findIndex(
        (cartItem) => cartItem.product.id === action.itemId,
      );

      if (existingIndex === -1) {
        return state;
      }

      const existing = state.items[existingIndex];

      if (existing.quantity > 1) {
        const nextItems = [...state.items];
        nextItems[existingIndex] = {
          ...existing,
          quantity: existing.quantity - 1,
        };

        return { items: nextItems };
      }

      return {
        items: state.items.filter(
          (cartItem) => cartItem.product.id !== action.itemId,
        ),
      };
    }

    case "SET_ACCESSORIES": {
      // Contract: selectedOptions is the FULL desired set for this group.
      // Idempotent — dispatching the same set twice yields the same state.
      const existingIndex = state.items.findIndex(
        (cartItem) => cartItem.product.id === action.itemId,
      );

      if (existingIndex === -1) {
        return state;
      }

      const existing = state.items[existingIndex];

      const keep = existing.selectedAccessories.filter(
        (accessory) => accessory.groupId !== action.group.id,
      );

      const nextAccessories = [
        ...keep,
        ...action.selectedOptions.map((option) =>
          toCartItemAccessory(action.group.id, option),
        ),
      ];

      const nextItems = [...state.items];
      nextItems[existingIndex] = {
        ...existing,
        selectedAccessories: nextAccessories,
      };

      return { items: nextItems };
    }

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
}

function toCartItemAccessory(
  groupId: number,
  option: PlainAccessoryOption,
): CartItemAccessory {
  return {
    optionId: option.id,
    groupId,
    name: option.name,
    priceDelta: option.priceDelta,
  };
}

export function getCartTotals(items: readonly CartItem[]): {
  totalItems: number;
  totalPrice: number;
} {
  let totalItems = 0;
  let totalPrice = 0;

  for (const item of items) {
    const unitPrice = getItemUnitPrice(item);
    totalItems += item.quantity;
    totalPrice += unitPrice * item.quantity;
  }

  return { totalItems, totalPrice };
}

export function getItemUnitPrice(item: CartItem): number {
  const accessoryTotal = item.selectedAccessories.reduce(
    (sum, accessory) => sum + accessory.priceDelta,
    0,
  );

  return item.product.price + accessoryTotal;
}

export function getItemQuantity(
  items: readonly CartItem[],
  itemId: number,
): number {
  return (
    items.find((cartItem) => cartItem.product.id === itemId)?.quantity ?? 0
  );
}

export function hasRequiredGroupsMissing(
  item: CartItem,
  accessoryGroups: readonly PlainAccessoryGroup[],
): boolean {
  return findRequiredGroupMissing(item, accessoryGroups) !== null;
}

export function findRequiredGroupMissing(
  item: CartItem,
  accessoryGroups: readonly PlainAccessoryGroup[],
): PlainAccessoryGroup | null {
  return (
    accessoryGroups.find(
      (group) =>
        group.isRequired &&
        !item.selectedAccessories.some(
          (accessory) => accessory.groupId === group.id,
        ),
    ) ?? null
  );
}

export function hasItemsWithAccessories(
  items: readonly CartItem[],
  accessoryGroupsByItemId: ReadonlyMap<number, readonly PlainAccessoryGroup[]>,
): boolean {
  return items.some(
    (item) => (accessoryGroupsByItemId.get(item.product.id)?.length ?? 0) > 0,
  );
}
