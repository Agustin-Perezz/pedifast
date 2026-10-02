"use client";

import type { CartItem } from "../../lib/cart-reducer";
import { ItemQuantityStepper } from "./item-quantity-stepper";

export type ItemMetadataRowProps = {
  readonly item: CartItem;
  readonly accessoryNames: string;
  readonly onAddItem: (item: CartItem) => void;
  readonly onRemoveItem: (item: CartItem) => void;
};

export function ItemMetadataRow({
  item,
  accessoryNames,
  onAddItem,
  onRemoveItem,
}: ItemMetadataRowProps) {
  return (
    <div className="mt-2 flex items-center justify-between gap-2">
      <ItemQuantityStepper
        item={item}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      />
      <span className="truncate text-[11px] text-muted-foreground">
        {accessoryNames}
      </span>
    </div>
  );
}
