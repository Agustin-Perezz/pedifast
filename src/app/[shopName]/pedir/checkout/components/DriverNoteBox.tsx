"use client";

import { Info } from "lucide-react";

import { Input } from "@/components/ui/input";

export function DriverNoteBox() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-surface-container-low p-2.5">
      <Info aria-hidden="true" className="size-4 shrink-0 text-outline" />
      <Input
        type="text"
        disabled
        value="Tocar timbre Luca. Dejar en portería si no responde."
        aria-label="Nota para el repartidor"
        className="flex-1 rounded-none border-none bg-transparent text-[12px] text-muted-foreground focus-visible:border-none focus-visible:ring-0 disabled:bg-transparent disabled:opacity-100"
      />
    </div>
  );
}
