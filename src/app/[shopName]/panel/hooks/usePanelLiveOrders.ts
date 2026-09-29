"use client";

import { useCallback, useState } from "react";
import { OrderStatus } from "@/domain/entities/order-status.enum";
import type { PlainPanelOrder } from "../lib/serialize-panel-order";
import { useOrderStream } from "./useOrderStream";
import { usePrintTicket } from "./usePrintTicket";

type UsePanelLiveOrdersInput = {
  readonly shopId: number;
  readonly initialPending: readonly PlainPanelOrder[];
  readonly initialConfirmed: readonly PlainPanelOrder[];
};

function includeOrder(
  list: readonly PlainPanelOrder[],
  order: PlainPanelOrder,
) {
  return list.some((existing) => existing.id === order.id)
    ? list
    : [order, ...list];
}

function excludeOrder(
  list: readonly PlainPanelOrder[],
  order: PlainPanelOrder,
) {
  return list.filter((existing) => existing.id !== order.id);
}

export function usePanelLiveOrders({
  shopId,
  initialPending,
  initialConfirmed,
}: UsePanelLiveOrdersInput) {
  const [pending, setPending] = useState(initialPending);
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  const { printingOrder, print } = usePrintTicket();

  const handleNewOrder = useCallback((order: PlainPanelOrder) => {
    setPending((current) => includeOrder(current, order));
  }, []);

  const handleOrderUpdated = useCallback((order: PlainPanelOrder) => {
    if (order.status === OrderStatus.Confirmed) {
      setPending((list) => excludeOrder(list, order));
      setConfirmed((list) => [order, ...excludeOrder(list, order)]);
    } else if (order.status === OrderStatus.Rejected) {
      setPending((list) => excludeOrder(list, order));
      setConfirmed((list) => excludeOrder(list, order));
    } else {
      setPending((list) => [order, ...excludeOrder(list, order)]);
      setConfirmed((list) => excludeOrder(list, order));
    }
  }, []);

  useOrderStream({
    shopId,
    onNewOrder: handleNewOrder,
    onOrderUpdated: handleOrderUpdated,
  });

  return { pending, confirmed, printingOrder, print };
}
