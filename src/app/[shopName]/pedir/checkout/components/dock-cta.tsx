"use client";

import { CircleCheck, Lock } from "lucide-react";

import { DOCK_CASH_CTA_LABEL, DOCK_MP_CTA_LABEL } from "./dock-cta-labels";

export type DockCtaProps = {
  readonly payingWithMercadoPago: boolean;
  readonly submitting: boolean;
  readonly onSubmit: () => void;
};

export function DockCta({
  payingWithMercadoPago,
  submitting,
  onSubmit,
}: DockCtaProps) {
  const Icon = payingWithMercadoPago ? Lock : CircleCheck;
  const label = payingWithMercadoPago ? DOCK_MP_CTA_LABEL : DOCK_CASH_CTA_LABEL;

  return (
    <button
      type="button"
      data-testid="checkout-submit"
      disabled={submitting}
      onClick={onSubmit}
      className="flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-bold text-background shadow-md transition-all active:scale-[0.98] hover:bg-foreground/90 disabled:opacity-60"
    >
      <Icon aria-hidden="true" className="size-4" />
      {label}
    </button>
  );
}
