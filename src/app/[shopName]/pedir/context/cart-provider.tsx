"use client";

import { useCallback, useMemo, useReducer } from "react";
import {
  type CartProduct,
  cartReducer,
  getCartTotals,
  getItemQuantity,
  hasItemsWithAccessories,
  hasRequiredGroupsMissing,
} from "../lib/cart-reducer";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../lib/serialize-catalog";
import { CartContext, EMPTY_CART } from "./cart-context";

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
