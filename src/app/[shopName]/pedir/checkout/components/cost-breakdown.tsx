"use client";

import { formatPrice } from "@/lib/utils/format";
import type { CostBreakdownProps } from "./cost-breakdown-props";
import { CostRow } from "./cost-row";
import { ShippingRow } from "./shipping-row";

export function CostBreakdown({
  totalItems,
  itemsTotal,
  deliveryCost,
  showShipping,
}: CostBreakdownProps) {
  const total = itemsTotal + (deliveryCost ?? 0);

  return (
    <div
      className="mt-6 flex flex-col gap-2.5 rounded-xl bg-card p-4 pb-2 shadow-sm"
      data-testid="checkout-summary"
    >
      <h3 className="pb-1 text-[15px] font-bold text-foreground">
        Detalle del pago
      </h3>
      <CostRow
        label={`Subtotal (${totalItems} ${totalItems === 1 ? "producto" : "productos"})`}
        value={formatPrice(itemsTotal)}
      />
      {showShipping && <ShippingRow deliveryCost={deliveryCost} />}
      <div className="my-1 h-px bg-surface-container" />
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex flex-col">
          <span className="font-heading text-lg font-bold text-foreground">
            Total final
          </span>
          <span className="text-[11px] text-muted-foreground">
            Incluye todos los impuestos
          </span>
        </div>
        <span className="font-heading text-[22px] font-bold tracking-tight text-foreground">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}
