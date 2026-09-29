"use client";

import { usePanelLiveOrders } from "../hooks/usePanelLiveOrders";
import type { PlainPanelOrder } from "../lib/serialize-panel-order";
import { PanelEmptyState } from "./PanelEmptyState";
import { PanelOrderList } from "./PanelOrderList";
import { PrintableTicket } from "./PrintableTicket";

type PanelOrdersLiveProps = {
  readonly shopName: string;
  readonly shopId: number;
  readonly initialPending: readonly PlainPanelOrder[];
  readonly initialConfirmed: readonly PlainPanelOrder[];
};

export function PanelOrdersLive({
  shopName,
  shopId,
  initialPending,
  initialConfirmed,
}: PanelOrdersLiveProps) {
  const { pending, confirmed, printingOrder, print } = usePanelLiveOrders({
    shopId,
    initialPending,
    initialConfirmed,
  });

  return (
    <>
      {pending.length === 0 && confirmed.length === 0 ? (
        <PanelEmptyState />
      ) : (
        <>
          <PanelOrderList
            shopName={shopName}
            title="Pendientes"
            orders={pending}
            variant="pending"
          />
          <PanelOrderList
            shopName={shopName}
            title="Confirmados"
            orders={confirmed}
            variant="confirmed"
            onPrint={print}
          />
        </>
      )}
      {printingOrder ? <PrintableTicket order={printingOrder} /> : null}
    </>
  );
}
