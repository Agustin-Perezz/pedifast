"use client";

import { useCallback, useState } from "react";
import type { PlainPanelOrder } from "../lib/serialize-panel-order";

export function usePrintTicket() {
  const [printingOrder, setPrintingOrder] = useState<PlainPanelOrder | null>(
    null,
  );

  const print = useCallback((order: PlainPanelOrder) => {
    setPrintingOrder(order);
    requestAnimationFrame(() => {
      window.print();
      setPrintingOrder(null);
    });
  }, []);

  return { printingOrder, print };
}
