import { AR_LOCALE } from "@/lib/utils/format";

import { ReceiptRow } from "./ReceiptRow";

const DATE_TIME_FORMAT = new Intl.DateTimeFormat(AR_LOCALE, {
  dateStyle: "medium",
  timeStyle: "short",
});

const PRICE_FORMAT = new Intl.NumberFormat(AR_LOCALE, {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

type ReceiptCardItem = {
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
};

type ReceiptCardProps = {
  readonly id: string;
  readonly nombre: string;
  readonly date: Date;
  readonly notas: string | null;
  readonly items: readonly ReceiptCardItem[];
  readonly total: number;
};

export function ReceiptCard({
  id,
  nombre,
  date,
  notas,
  items,
  total,
}: ReceiptCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-4">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
        <svg
          className="h-4 w-4 text-zinc-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
          <path d="M8 7h8M8 11h8M8 15h4" />
        </svg>
        <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
          Recibo
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <ReceiptRow label="Pedido" value={id} mono />
        <ReceiptRow label="Nombre" value={nombre} />
        <ReceiptRow label="Fecha" value={DATE_TIME_FORMAT.format(date)} />
        {notas ? <ReceiptRow label="Notas" value={notas} /> : null}
      </div>
      <div className="flex flex-col gap-2 border-t border-zinc-100 pt-3">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-500">
                {item.quantity}x
              </span>
              <span className="text-sm text-zinc-950">{item.name}</span>
            </div>
            <span className="text-sm text-zinc-950">
              {PRICE_FORMAT.format(item.unitPrice * item.quantity)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-2">
          <span className="text-sm font-medium text-zinc-950">Total</span>
          <span className="text-sm font-semibold text-zinc-950">
            {PRICE_FORMAT.format(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
