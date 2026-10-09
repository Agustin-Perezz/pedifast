"use client";

import { Lock } from "lucide-react";

export function PaymentProtectedBadge() {
  return (
    <span className="flex items-center gap-1 text-[11px] font-semibold text-chart-2">
      <Lock aria-hidden="true" className="size-3.5" />
      100% protegido
    </span>
  );
}
