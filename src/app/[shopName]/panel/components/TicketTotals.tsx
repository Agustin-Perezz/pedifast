import { AR_LOCALE } from "@/lib/utils/format";

import type { PlainPanelOrder } from "../lib/serialize-panel-order";

export function TicketTotals({ order }: TicketTotalsProps) {
  return (
    <div>
      <hr className="my-1.5 border-t border-dashed border-black" />
      {order.deliveryCost > 0 ? (
        <div className="my-0.5 flex justify-between text-xs">
          <span>Envio</span>
          <span>${order.deliveryCost.toLocaleString(AR_LOCALE)}</span>
        </div>
      ) : null}
      <div className="my-1 flex justify-between text-[15px] font-bold">
        <span>TOTAL</span>
        <span>${order.total.toLocaleString(AR_LOCALE)}</span>
      </div>
      {order.notes ? (
        <p className="m-0 text-[11px] italic">NOTAS: {order.notes}</p>
      ) : null}
    </div>
  );
}

type TicketTotalsProps = {
  readonly order: PlainPanelOrder;
};
