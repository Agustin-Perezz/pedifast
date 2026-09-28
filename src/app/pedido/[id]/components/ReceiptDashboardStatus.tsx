import { ReceiptStatusBadge } from "./ReceiptStatusBadge";

type ReceiptDashboardStatusProps = {
  readonly status: string;
  readonly orderId: string;
  readonly paymentId: string | null;
  readonly backUrl: string;
};

export function ReceiptDashboardStatus({
  status,
  orderId,
  paymentId,
  backUrl,
}: ReceiptDashboardStatusProps) {
  return (
    <main className="flex flex-1 flex-col items-center gap-6 px-4 py-6">
      <ReceiptStatusBadge status={status} />
      <p className="text-center text-sm text-zinc-500">
        Tu pedido fue recibido. El local lo confirmará en breve.
      </p>
      <p className="text-center text-xs text-zinc-400">Pedido #{orderId}</p>
      {paymentId ? (
        <p className="text-center text-xs text-zinc-400">
          ID de pago: {paymentId}
        </p>
      ) : null}
      <a
        href={backUrl}
        className="flex h-11 w-full max-w-sm items-center justify-center rounded-lg border border-zinc-200 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
      >
        Realizar otro pedido
      </a>
    </main>
  );
}
