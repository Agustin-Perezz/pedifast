"use client";

import { SmilePlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { TipValue } from "./tip-values";
import { DEFAULT_TIP, TIP_OPTIONS, tipLabel } from "./tip-values";

export function TipSection() {
  const [selectedTip, setSelectedTip] = useState<TipValue>(DEFAULT_TIP);

  return (
    <section className="mt-6 flex flex-col gap-2" data-testid="tip-section">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[15px] font-bold text-foreground">
          <SmilePlus aria-hidden="true" className="size-[18px] text-chart-2" />
          Propina para el repartidor
        </span>
        <span className="text-[11px] text-muted-foreground">100% para él</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {TIP_OPTIONS.map((value: TipValue) => (
          <Button
            key={value}
            type="button"
            variant="ghost"
            data-testid={`tip-option-${value}`}
            aria-pressed={selectedTip === value}
            onClick={() => setSelectedTip(value)}
            className={tipButtonClass(selectedTip === value)}
          >
            {tipLabel(value)}
          </Button>
        ))}
      </div>
    </section>
  );
}

function tipButtonClass(selected: boolean): string {
  if (selected) {
    return "rounded-lg bg-foreground py-2 text-center text-[12px] font-bold text-background shadow-sm transition-colors hover:bg-foreground";
  }

  return "rounded-lg bg-surface-container py-2 text-center text-[12px] font-semibold text-foreground transition-colors hover:bg-surface-container-high";
}
