"use client";

export function EtaRow() {
  return (
    <div className="flex items-center justify-between pt-1">
      <div className="flex min-w-0 items-center gap-2">
        <span className="size-2 shrink-0 rounded-full bg-chart-2" />
        <span className="shrink-0 text-[12px] font-bold text-chart-2">
          20–30 min
        </span>
        <span className="truncate text-[12px] text-muted-foreground">
          • Horno a leña encendido
        </span>
      </div>
      <span className="shrink-0 text-[11px] text-muted-foreground">
        Rastreo en vivo
      </span>
    </div>
  );
}
