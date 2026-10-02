"use client";

import { formatPrice } from "@/lib/utils/format";
import {
  COST_BREAKDOWN_TITLE,
  SUBTOTAL_LABEL_PREFIX,
  SUBTOTAL_WORD,
  SUBTOTAL_WORD_PLURAL,
  TAXES_INCLUDED_LABEL,
  TOTAL_FINAL_LABEL,
} from "./cost-breakdown-labels";
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
        {COST_BREAKDOWN_TITLE}
      </h3>
      <CostRow
        label={`${SUBTOTAL_LABEL_PREFIX} (${totalItems} ${totalItems === 1 ? SUBTOTAL_WORD : SUBTOTAL_WORD_PLURAL})`}
        value={formatPrice(itemsTotal)}
      />
      {showShipping && <ShippingRow deliveryCost={deliveryCost} />}
      <div className="my-1 h-px bg-surface-container" />
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex flex-col">
          <span className="font-heading text-lg font-bold text-foreground">
            {TOTAL_FINAL_LABEL}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {TAXES_INCLUDED_LABEL}
          </span>
        </div>
        <span className="font-heading text-[22px] font-bold tracking-tight text-foreground">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
}
