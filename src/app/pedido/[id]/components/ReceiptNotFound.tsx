type ReceiptNotFoundProps = {
  readonly backUrl: string;
};

export function ReceiptNotFound({ backUrl }: ReceiptNotFoundProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3">
        <span className="text-sm text-zinc-500">Pedido no encontrado</span>
        <a
          href={backUrl}
          className="text-sm font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-700"
        >
          Volver al menu
        </a>
      </div>
    </main>
  );
}
