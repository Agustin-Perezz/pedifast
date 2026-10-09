"use client";

import { ItemMetadataRow } from "./ItemMetadataRow";
import { ItemNameRow } from "./ItemNameRow";
import { ItemThumbnail } from "./ItemThumbnail";
import type { OrderItemRowProps } from "./order-item-row-types";

export function OrderItemRow({
  item,
  extras,
  onAddItem,
  onRemoveItem,
}: OrderItemRowProps) {
  const accessoryNames = item.selectedAccessories
    .map((accessory) => accessory.name)
    .join(", ");

  return (
    <div className="flex items-center gap-3">
      <ItemThumbnail image={extras?.image ?? null} name={item.product.name} />
      <div className="min-w-0 flex-1">
        <ItemNameRow item={item} description={extras?.description ?? null} />
        <ItemMetadataRow
          item={item}
          accessoryNames={accessoryNames}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
        />
      </div>
    </div>
  );
}
