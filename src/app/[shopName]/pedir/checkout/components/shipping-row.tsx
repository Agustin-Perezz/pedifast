"use client";

import { formatPrice } from "@/lib/utils/format";

import {
  SHIPPING_FREE_LABEL,
  SHIPPING_LABEL,
  SHIPPING_PENDING_LABEL,
} from "./cost-breakdown-labels";

export type ShippingRowProps = {
  readonly deliveryCost: number | null;
};

export function ShippingRow({ deliveryCost }: ShippingRowProps) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>{SHIPPING_LABEL}</span>
      <ShippingValue deliveryCost={deliveryCost} />
    </div>
  );
}

function ShippingValue({ deliveryCost }: ShippingValueProps) {
  if (deliveryCost === null) {
    return <span>{SHIPPING_PENDING_LABEL}</span>;
  }

  if (deliveryCost === 0) {
    return (
      <span className="rounded-full bg-secondary-container/50 px-2 py-0.5 text-[11px] font-bold text-on-secondary-container">
        {SHIPPING_FREE_LABEL}
      </span>
    );
  }

  return (
    <span className="font-medium text-foreground">
      {formatPrice(deliveryCost)}
    </span>
  );
}

type ShippingValueProps = {
  readonly deliveryCost: number | null;
};
