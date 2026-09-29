import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { AR_LOCALE } from "@/lib/utils/format";

import { PICKUP_LABEL } from "../../pedir/lib/checkout-labels";
import type { PlainPanelOrder } from "../lib/serialize-panel-order";

const CURRENCY_FORMAT = new Intl.NumberFormat(AR_LOCALE, {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
});

const TIME_FORMAT = new Intl.DateTimeFormat(AR_LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
});

type PanelOrderSummaryProps = {
  readonly order: PlainPanelOrder;
};

export function PanelOrderSummary({ order }: PanelOrderSummaryProps) {
  return (
    <div className="mb-3">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-950">
            {order.customerName}
          </p>
          <p className="text-xs text-zinc-500">
            {TIME_FORMAT.format(new Date(order.createdAt))}
          </p>
        </div>
        <span className="text-xs font-medium text-zinc-600">
          {order.deliveryMethod === DeliveryMethod.Delivery
            ? `Envío: ${order.address ?? ""}`
            : PICKUP_LABEL}
        </span>
      </div>
      <div className="space-y-1">
        {order.items.map((item) => (
          <div key={item.name} className="flex justify-between text-sm">
            <span className="text-zinc-700">
              {item.quantity}x {item.name}
            </span>
            <span className="text-zinc-500">
              {CURRENCY_FORMAT.format(item.unitPrice * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      {order.notes ? (
        <p className="mb-2 text-xs text-zinc-500 italic">"{order.notes}"</p>
      ) : null}
      <div className="mt-3 flex justify-between border-t border-zinc-100 pt-2">
        <span className="text-sm font-medium text-zinc-950">Total</span>
        <span className="text-sm font-semibold text-zinc-950">
          {CURRENCY_FORMAT.format(order.total)}
        </span>
      </div>
    </div>
  );
}
