"use client";

import { Lock } from "lucide-react";

import { PAYMENT_PROTECTED_LABEL } from "./payment-protection-labels";

export function PaymentProtectedBadge() {
  return (
    <span className="flex items-center gap-1 text-[11px] font-semibold text-chart-2">
      <Lock aria-hidden="true" className="size-3.5" />
      {PAYMENT_PROTECTED_LABEL}
    </span>
  );
}
