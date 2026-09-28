import type { PendingWhatsappOrder } from "@/app/[shopName]/pedir/lib/whatsapp";
import { ReceiptCard } from "./ReceiptCard";
import { ReceiptStatusBadge } from "./ReceiptStatusBadge";

type ReceiptOrderDetailsProps = {
  readonly order: PendingWhatsappOrder;
  readonly orderId: string;
  readonly orderDate: Date;
  readonly paymentId: string | null;
  readonly whatsappUrl: string | null;
  readonly isConfirmed: boolean;
  readonly backUrl: string;
};

export function ReceiptOrderDetails({
  order,
  orderId,
  orderDate,
  paymentId,
  whatsappUrl,
  isConfirmed,
  backUrl,
}: ReceiptOrderDetailsProps) {
  return (
    <main className="flex flex-1 flex-col gap-6 px-4 py-6">
      <ReceiptStatusBadge status={isConfirmed ? "approved" : "pending"} />
      <p className="text-center text-sm text-zinc-500">
        Gracias, {order.nombre}.
      </p>
      <ReceiptCard
        id={orderId}
        nombre={order.nombre}
        date={orderDate}
        notas={order.notas}
        items={order.items}
        total={order.total}
      />
      {paymentId ? (
        <p className="text-center text-xs text-zinc-400">
          ID de pago: {paymentId}
        </p>
      ) : null}
      {whatsappUrl && isConfirmed ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center justify-center rounded-lg bg-[#25D366] text-sm font-medium text-white transition-colors hover:bg-[#25D366]/90"
        >
          Enviar pedido por WhatsApp
        </a>
      ) : null}
      <a
        href={backUrl}
        className="flex h-11 items-center justify-center rounded-lg border border-zinc-200 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
      >
        Realizar otro pedido
      </a>
    </main>
  );
}
