"use client";

import { useCallback, useState } from "react";
import { confirmOrderAction, rejectOrderAction } from "../actions";
import type { PanelActionResult } from "../lib/panel-action-result";
import type { PlainPanelOrder } from "../lib/serialize-panel-order";

type PanelAction = (input: {
  readonly shopName: string;
  readonly orderId: number;
}) => Promise<PanelActionResult>;

export function usePanelOrderActions(shopName: string) {
  const [isBusy, setIsBusy] = useState(false);

  const runAction = useCallback(
    async (action: PanelAction, order: PlainPanelOrder) => {
      setIsBusy(true);
      try {
        const result = await action({ shopName, orderId: order.id });

        if (result.ok && result.whatsappUrl) {
          window.open(result.whatsappUrl, "_blank");
        }
      } finally {
        setIsBusy(false);
      }
    },
    [shopName],
  );

  const confirm = useCallback(
    (order: PlainPanelOrder) => runAction(confirmOrderAction, order),
    [runAction],
  );

  const reject = useCallback(
    (order: PlainPanelOrder) => runAction(rejectOrderAction, order),
    [runAction],
  );

  return { confirm, reject, isBusy };
}
