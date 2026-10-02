"use client";

import { Receipt } from "lucide-react";

import { formatPrice } from "@/lib/utils/format";
import { DockCta } from "./dock-cta";
import { DOCK_TERMS_LABEL, DOCK_TOTAL_LABEL } from "./dock-labels";

export type CheckoutDockProps = {
  readonly total: number;
  readonly payingWithMercadoPago: boolean;
  readonly submitting: boolean;
  readonly onSubmit: () => void;
};

export function CheckoutDock({
  total,
  payingWithMercadoPago,
  submitting,
  onSubmit,
}: CheckoutDockProps) {
  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-5">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 rounded-full bg-card p-2 shadow-xl">
        <div className="flex items-center gap-2 pl-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-background">
            <Receipt aria-hidden="true" className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {DOCK_TOTAL_LABEL}
            </span>
            <span className="text-[17px] font-bold leading-tight text-foreground">
              {formatPrice(total)}
            </span>
          </div>
        </div>
        <DockCta
          payingWithMercadoPago={payingWithMercadoPago}
          submitting={submitting}
          onSubmit={onSubmit}
        />
      </div>
      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        {DOCK_TERMS_LABEL}
      </p>
    </div>
  );
}
