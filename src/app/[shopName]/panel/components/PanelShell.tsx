type PanelShellProps = {
  readonly shopName: string;
  readonly children: React.ReactNode;
};

export function PanelShell({ children }: PanelShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <h1 className="text-lg font-semibold text-zinc-950">
            Panel de pedidos
          </h1>
        </div>
      </header>
      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
