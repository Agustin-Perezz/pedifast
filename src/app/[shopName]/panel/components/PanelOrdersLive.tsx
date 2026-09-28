"use client";

import { useCallback, useState } from "react";
import { useOrderStream } from "../hooks/useOrderStream";
import { usePrintTicket } from "../hooks/usePrintTicket";
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
  const [pending, setPending] = useState(initialPending);
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  const { printingOrder, print } = usePrintTicket();

  const handleNewOrder = useCallback((order: PlainPanelOrder) => {
    setPending((current) =>
      current.some((existing) => existing.id === order.id)
        ? current
        : [order, ...current],
    );
  }, []);

  const handleOrderUpdated = useCallback((order: PlainPanelOrder) => {
    const remove = (list: readonly PlainPanelOrder[]) =>
      list.filter((existing) => existing.id !== order.id);

    if (order.status === "confirmed") {
      setPending((list) => remove(list));
      setConfirmed((list) => [order, ...remove(list)]);
    } else if (order.status === "rejected") {
      setPending((list) => remove(list));
      setConfirmed((list) => remove(list));
    } else {
      setPending((list) => [order, ...remove(list)]);
      setConfirmed((list) => remove(list));
    }
  }, []);

  useOrderStream({
    shopId,
    onNewOrder: handleNewOrder,
    onOrderUpdated: handleOrderUpdated,
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
