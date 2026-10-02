"use client";

import { Button } from "@/components/ui/button";

import type { CashAmountValue } from "./payment-option-ids";
import { CASH_AMOUNT_LABELS, CASH_AMOUNT_OPTIONS } from "./payment-option-ids";

export function CashAmountOptions() {
  return (
    <div className="flex flex-col gap-2 pt-1">
      <span className="text-[11px] text-muted-foreground">
        ¿Con cuánto vas a pagar? (Para llevarte cambio):
      </span>
      <div className="flex flex-wrap gap-2">
        {CASH_AMOUNT_OPTIONS.map((value: CashAmountValue) => (
          <Button
            key={value}
            type="button"
            disabled
            className="rounded-full bg-surface-container px-3 py-1 text-[11px] font-semibold text-foreground"
          >
            {CASH_AMOUNT_LABELS[value]}
          </Button>
        ))}
      </div>
    </div>
  );
}
