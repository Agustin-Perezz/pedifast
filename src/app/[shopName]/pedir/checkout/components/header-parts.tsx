"use client";

import { ArrowLeft } from "lucide-react";

export type BackButtonProps = {
  readonly href: string;
  readonly label: string;
};

export function BackButton({ href, label }: BackButtonProps) {
  return (
    <a
      href={href}
      aria-label={label}
      data-testid="checkout-back-button"
      className="flex size-10 items-center justify-center rounded-full bg-surface-container text-foreground transition-colors hover:bg-surface-container-high"
    >
      <ArrowLeft aria-hidden="true" className="size-5" />
    </a>
  );
}

export type StepBadgeProps = {
  readonly label: string;
};

export function StepBadge({ label }: StepBadgeProps) {
  return (
    <span
      data-testid="checkout-step-badge"
      className="shrink-0 rounded-full bg-surface-container-high px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
    >
      {label}
    </span>
  );
}
