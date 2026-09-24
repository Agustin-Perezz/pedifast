type ReceiptShellProps = {
  readonly title: string;
  readonly backUrl: string;
  readonly children: React.ReactNode;
};

export function ReceiptShell({ title, backUrl, children }: ReceiptShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-3 px-4 py-4">
          <a
            href={backUrl}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
          >
            <span className="sr-only">Volver al menú</span>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-base font-semibold text-zinc-950">{title}</h1>
        </div>
      </header>
      {children}
    </div>
  );
}
