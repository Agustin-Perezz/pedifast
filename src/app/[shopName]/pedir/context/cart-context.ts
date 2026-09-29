import { createContext } from "react";
import type { CartItem, CartProduct } from "../lib/cart-reducer";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../lib/serialize-catalog";

export const EMPTY_CART = { items: [] };

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

export const CartContext = createContext<CartContextValue | null>(null);
