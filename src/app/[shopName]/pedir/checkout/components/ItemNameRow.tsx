"use client";

import { formatPrice } from "@/lib/utils/format";

import type { CartItem } from "../../lib/cart-reducer";
import { getItemUnitPrice } from "../../lib/cart-reducer";

export type ItemNameRowProps = {
  readonly item: CartItem;
  readonly description: string | null;
};

export function ItemNameRow({ item, description }: ItemNameRowProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-1">
        <span className="truncate text-[15px] font-bold text-foreground">
          {item.product.name}
        </span>
        <span className="shrink-0 text-[15px] font-bold text-foreground">
          {formatPrice(getItemUnitPrice(item))}
        </span>
      </div>
      {description && (
        <p className="truncate text-[12px] text-muted-foreground">
          {description}
        </p>
      )}
    </>
  );
}
