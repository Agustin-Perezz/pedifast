"use client";

import { Info } from "lucide-react";

import { DRIVER_NOTE_ARIA, DRIVER_NOTE_DEFAULT } from "./driver-note-labels";

export function DriverNoteBox() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface-container-low p-2.5">
      <Info aria-hidden="true" className="size-4 shrink-0 text-outline" />
      <input
        type="text"
        disabled
        value={DRIVER_NOTE_DEFAULT}
        aria-label={DRIVER_NOTE_ARIA}
        className="flex-1 bg-transparent text-[12px] text-muted-foreground"
      />
    </div>
  );
}
