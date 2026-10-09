"use client";

import type { CartContextValue } from "../../context/cart-context";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../../lib/serialize-catalog";
import type { PatchCheckoutForm } from "../hooks/useCheckoutScreen";
import { cartProductFromItem } from "./cart-product-from-item";
import type { CartItemExtras } from "./item-extras-map";
import { itemsCountLabel } from "./items-count-label";
import { KitchenNotesCard } from "./KitchenNotesCard";
import { OrderItemsList } from "./OrderItemsList";

export type OrderSectionProps = {
  readonly cart: CartContextValue;
  readonly itemExtras: ReadonlyMap<number, CartItemExtras>;
  readonly accessoryGroupsByItemId: ReadonlyMap<
    number,
    readonly PlainAccessoryGroup[]
  >;
  readonly onSelectAccessories: (
    itemId: number,
    group: PlainAccessoryGroup,
    selectedOptions: readonly PlainAccessoryOption[],
  ) => void;
  readonly showMissingAccessoryHints: boolean;
  readonly shopName: string;
  readonly notas: string;
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function OrderSection({
  cart,
  itemExtras,
  accessoryGroupsByItemId,
  onSelectAccessories,
  showMissingAccessoryHints,
  shopName,
  notas,
  onChange,
}: OrderSectionProps) {
  return (
    <section className="mt-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">
          Tu pedido
        </h3>
        <span className="text-xs text-muted-foreground">
          {itemsCountLabel(cart.totalItems)}
        </span>
      </div>
      <OrderItemsList
        items={cart.items}
        itemExtras={itemExtras}
        accessoryGroupsByItemId={accessoryGroupsByItemId}
        onSelectAccessories={onSelectAccessories}
        showMissingAccessoryHints={showMissingAccessoryHints}
        shopName={shopName}
        onAddItem={(item) => cart.addItem(cartProductFromItem(item))}
        onRemoveItem={(item) => cart.removeItem(item.product.id)}
      />
      <KitchenNotesCard value={notas} onChange={onChange} />
    </section>
  );
}
