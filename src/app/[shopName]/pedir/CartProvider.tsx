"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import {
  type CartItem,
  type CartProduct,
  cartReducer,
  getCartTotals,
  getItemQuantity,
  hasItemsWithAccessories,
  hasRequiredGroupsMissing,
} from "./lib/cart-reducer";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "./lib/serialize-catalog";

const EMPTY_CART = { items: [] };

export type CartContextValue = {
  readonly items: readonly CartItem[];
  readonly totalItems: number;
  readonly totalPrice: number;
  readonly isEmpty: boolean;
  readonly hasItemsWithAccessories: (
    accessoryGroupsByItemId: ReadonlyMap<
      number,
      readonly PlainAccessoryGroup[]
    >,
  ) => boolean;
  readonly addItem: (product: CartProduct) => void;
  readonly removeItem: (itemId: number) => void;
  readonly setAccessories: (
    itemId: number,
    group: PlainAccessoryGroup,
    selectedOptions: readonly PlainAccessoryOption[],
  ) => void;
  readonly clearCart: () => void;
  readonly getQuantity: (itemId: number) => number;
  readonly hasMissingRequiredGroups: (
    itemId: number,
    accessoryGroups: readonly PlainAccessoryGroup[],
  ) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const addItemAction = (product: CartProduct) => ({
  type: "ADD_ITEM" as const,
  product,
});
const removeItemAction = (itemId: number) => ({
  type: "REMOVE_ITEM" as const,
  itemId,
});
const clearCartAction = () => ({ type: "CLEAR_CART" as const });
const setAccessoriesAction = (
  itemId: number,
  group: PlainAccessoryGroup,
  selectedOptions: readonly PlainAccessoryOption[],
) => ({
  type: "SET_ACCESSORIES" as const,
  itemId,
  group,
  selectedOptions,
});

export function CartProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(cartReducer, EMPTY_CART);

  const { totalItems, totalPrice } = useMemo(
    () => getCartTotals(state.items),
    [state.items],
  );

  const findItem = useCallback(
    (itemId: number) =>
      state.items.find((cartItem) => cartItem.product.id === itemId),
    [state.items],
  );

  const addItem = useCallback(
    (product: CartProduct) => dispatch(addItemAction(product)),
    [],
  );
  const removeItem = useCallback(
    (itemId: number) => dispatch(removeItemAction(itemId)),
    [],
  );
  const clearCart = useCallback(() => dispatch(clearCartAction()), []);
  const setAccessories = useCallback(
    (
      itemId: number,
      group: PlainAccessoryGroup,
      selectedOptions: readonly PlainAccessoryOption[],
    ) => dispatch(setAccessoriesAction(itemId, group, selectedOptions)),
    [],
  );

  const getQuantity = useCallback(
    (itemId: number) => getItemQuantity(state.items, itemId),
    [state.items],
  );

  const hasMissingRequiredGroups = useCallback(
    (itemId: number, accessoryGroups: readonly PlainAccessoryGroup[]) => {
      const item = findItem(itemId);
      return item ? hasRequiredGroupsMissing(item, accessoryGroups) : false;
    },
    [findItem],
  );

  const value = useMemo(
    () => ({
      items: state.items,
      totalItems,
      totalPrice,
      isEmpty: state.items.length === 0,
      hasItemsWithAccessories: (
        accessoryGroupsByItemId: ReadonlyMap<
          number,
          readonly PlainAccessoryGroup[]
        >,
      ) => hasItemsWithAccessories(state.items, accessoryGroupsByItemId),
      addItem,
      removeItem,
      setAccessories,
      clearCart,
      getQuantity,
      hasMissingRequiredGroups,
    }),
    [
      state.items,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      setAccessories,
      clearCart,
      getQuantity,
      hasMissingRequiredGroups,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
