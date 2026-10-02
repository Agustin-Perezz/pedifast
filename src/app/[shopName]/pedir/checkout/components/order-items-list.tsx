"use client";

import { CirclePlus } from "lucide-react";
import type { CartItem } from "../../lib/cart-reducer";
import type { CartItemExtras } from "../components/item-extras-map";
import { OrderItemRow } from "./order-item-row";

export type OrderItemsListProps = {
  readonly items: readonly CartItem[];
  readonly itemExtras: ReadonlyMap<number, CartItemExtras>;
  readonly shopName: string;
  readonly onAddItem: (item: CartItem) => void;
  readonly onRemoveItem: (item: CartItem) => void;
};

export function OrderItemsList({
  items,
  itemExtras,
  shopName,
  onAddItem,
  onRemoveItem,
}: OrderItemsListProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-xl bg-card p-3 shadow-sm">
        {items.map((item, index) => (
          <div key={item.product.id}>
            {index > 0 && <div className="h-px w-full bg-surface-container" />}
            <OrderItemRow
              item={item}
              extras={itemExtras.get(item.product.id)}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
            />
          </div>
        ))}
      </div>
      <AddMoreProductsLink shopName={shopName} />
    </div>
  );
}

function AddMoreProductsLink({ shopName }: { readonly shopName: string }) {
  return (
    <a
      href={`/${shopName}/pedir`}
      className="inline-flex items-center gap-1.5 self-start py-1 text-sm font-bold text-primary hover:text-primary-container"
      data-testid="add-more-products"
      aria-label="Agregar más productos al pedido"
    >
      <CirclePlus aria-hidden="true" className="size-[18px]" />
      Agregar más productos
    </a>
  );
}
