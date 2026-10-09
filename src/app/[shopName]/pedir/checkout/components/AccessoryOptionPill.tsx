"use client";

import { Check, CircleDot } from "lucide-react";

import { formatPrice } from "@/lib/utils/format";

import type { PlainAccessoryOption } from "../../lib/serialize-catalog";

export type AccessoryOptionPillProps = {
  readonly option: PlainAccessoryOption;
  readonly selected: boolean;
  readonly isSingle: boolean;
  readonly onToggle: () => void;
};

export function AccessoryOptionPill({
  option,
  selected,
  isSingle,
  onToggle,
}: AccessoryOptionPillProps) {
  const SelectedIcon = isSingle ? CircleDot : Check;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      data-testid={`accessory-option-${option.id}`}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-surface-container text-foreground hover:bg-surface-container-high"
      }`}
    >
      <SelectedIcon
        aria-hidden="true"
        className={`size-3.5 ${selected ? "" : "text-outline"}`}
      />
      {option.name}
      {option.priceDelta > 0 && (
        <span className={selected ? "opacity-80" : "text-muted-foreground"}>
          +{formatPrice(option.priceDelta)}
        </span>
      )}
    </button>
  );
}
