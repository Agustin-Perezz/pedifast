"use client";

import { useEffect } from "react";
import { playNotificationSound } from "@/lib/utils/notification-sound";
import type { PlainPanelOrder } from "../lib/serialize-panel-order";

type UseOrderStreamInput = {
  readonly shopId: number;
  readonly onNewOrder: (order: PlainPanelOrder) => void;
  readonly onOrderUpdated: (order: PlainPanelOrder) => void;
};

const STREAM_PATH_PREFIX = "/api/orders";

export function useOrderStream({
  shopId,
  onNewOrder,
  onOrderUpdated,
}: UseOrderStreamInput): void {
  useEffect(() => {
    const eventSource = new EventSource(
      `${STREAM_PATH_PREFIX}/${shopId}/stream`,
    );

    const handle = (callback: (order: PlainPanelOrder) => void) => {
      return (event: MessageEvent<string>) => {
        callback(JSON.parse(event.data) as PlainPanelOrder);
      };
    };

    eventSource.addEventListener("new_order", (event) => {
      handle(onNewOrder)(event as MessageEvent<string>);
      playNotificationSound();
    });

    eventSource.addEventListener("order_updated", (event) => {
      handle(onOrderUpdated)(event as MessageEvent<string>);
    });

    // EventSource auto-reconnects on error by default.

    return () => {
      eventSource.close();
    };
  }, [shopId, onNewOrder, onOrderUpdated]);
}
