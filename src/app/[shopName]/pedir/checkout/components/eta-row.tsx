"use client";

import { etaRowLabels } from "./eta-row-labels";

export function EtaRow() {
  return (
    <div className="flex items-center justify-between pt-1">
      <div className="flex min-w-0 items-center gap-2">
        <span className="size-2 shrink-0 rounded-full bg-chart-2" />
        <span className="shrink-0 text-[12px] font-bold text-chart-2">
          {etaRowLabels.eta}
        </span>
        <span className="truncate text-[12px] text-muted-foreground">
          • {etaRowLabels.kitchenStatus}
        </span>
      </div>
      <span className="shrink-0 text-[11px] text-muted-foreground">
        {etaRowLabels.liveTracking}
      </span>
    </div>
  );
}
