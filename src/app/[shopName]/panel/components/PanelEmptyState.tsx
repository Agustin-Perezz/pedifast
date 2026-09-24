export function PanelEmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
        <svg
          className="h-6 w-6 text-zinc-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect width="6" height="4" x="9" y="3" rx="1" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      </div>
      <p className="text-sm text-zinc-500">No hay pedidos pendientes</p>
      <p className="text-xs text-zinc-400">
        Los nuevos pedidos aparecerán aquí en tiempo real.
      </p>
    </div>
  );
}
