"use client";

import { ShippingValue } from "./ShippingValue";

export type ShippingRowProps = {
  readonly deliveryCost: number | null;
};

export function ShippingRow({ deliveryCost }: ShippingRowProps) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>Costo de envío</span>
      <ShippingValue deliveryCost={deliveryCost} />
    </div>
  );
}
