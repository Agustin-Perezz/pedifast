"use client";

import { MapPin } from "lucide-react";

import { addressChipLabels } from "./address-chip-labels";

export type AddressSummaryRowProps = {
  readonly address: string;
};

export function AddressSummaryRow({ address }: AddressSummaryRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-fixed/60 text-primary">
        <MapPin className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[15px] font-bold text-foreground">
            {address}
          </span>
          <span className="shrink-0 rounded-full bg-surface-container px-2 py-0.5 text-[10px] text-muted-foreground">
            {addressChipLabels.tag}
          </span>
        </div>
      </div>
      <AddressSummaryActions label={addressChipLabels.editCta} />
    </div>
  );
}

function AddressSummaryActions({ label }: { readonly label: string }) {
  return (
    <button
      type="button"
      disabled
      className="shrink-0 cursor-not-allowed text-xs font-bold text-primary opacity-50"
    >
      {label}
    </button>
  );
}
