import type { CartItem } from "../../lib/cart-reducer";
import type { CartItemExtras } from "../components/item-extras-map";

export type OrderItemRowProps = {
  readonly item: CartItem;
  readonly extras: CartItemExtras | undefined;
  readonly onAddItem: (item: CartItem) => void;
  readonly onRemoveItem: (item: CartItem) => void;
};
