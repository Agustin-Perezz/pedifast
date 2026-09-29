import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { AR_LOCALE } from "@/lib/utils/format";

import { PICKUP_LABEL } from "../../pedir/lib/checkout-labels";
import type { PlainPanelOrder } from "../lib/serialize-panel-order";

const DATE_TIME_FORMAT = new Intl.DateTimeFormat(AR_LOCALE, {
  dateStyle: "short",
  timeStyle: "short",
});

type PrintableTicketProps = {
  readonly order: PlainPanelOrder;
};

export function PrintableTicket({ order }: PrintableTicketProps) {
  return (
    <div
      data-print-ticket
      className="hidden print:block print:w-[80mm] print:bg-white print:p-[4mm] print:font-mono print:text-xs print:text-black"
    >
      <h1 className="mb-0.5 text-center text-lg font-bold">COMANDA</h1>
      <p className="m-0 text-center text-[11px] text-gray-700">
        {DATE_TIME_FORMAT.format(new Date(order.createdAt))}
      </p>
      <p className="m-0 text-center text-[11px] text-gray-700">
        #{order.externalReference}
      </p>
      <hr className="my-1.5 border-t border-dashed border-black" />
      <p className="m-0 text-[13px] font-bold">{order.customerName}</p>
      {order.customerPhone ? (
        <p className="my-0.5 text-[11px]">Tel: {order.customerPhone}</p>
      ) : null}
      <p className="my-0.5 text-[11px]">
        {order.deliveryMethod === DeliveryMethod.Delivery
          ? `ENVIO: ${order.address ?? ""}`
          : PICKUP_LABEL.toUpperCase()}
      </p>
      <hr className="my-1.5 border-t border-dashed border-black" />
      {order.items.map((item, index) => (
        <TicketItemLine key={`${item.name}-${index}`} item={item} />
      ))}
      <TicketTotals order={order} />
    </div>
  );
}

type TicketItemLineProps = {
  readonly item: PlainPanelOrder["items"][number];
};

function TicketItemLine({ item }: TicketItemLineProps) {
  return (
    <div className="my-0.5">
      <div className="flex gap-1.5 text-[13px]">
        <span className="min-w-6 font-bold">{item.quantity}x</span>
        <span>{item.name}</span>
      </div>
      {item.accessories.map((accessory, index) => (
        <p key={index} className="m-0 ml-7 text-[11px] text-gray-700">
          + {accessory.name}
        </p>
      ))}
    </div>
  );
}

type TicketTotalsProps = {
  readonly order: PlainPanelOrder;
};

function TicketTotals({ order }: TicketTotalsProps) {
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
