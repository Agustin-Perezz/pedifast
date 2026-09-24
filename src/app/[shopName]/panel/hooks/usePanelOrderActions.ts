"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { confirmOrderAction, rejectOrderAction } from "../actions";
import type { PlainPanelOrder } from "../lib/serialize-panel-order";

export function usePanelOrderActions(shopName: string) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const [, startTransition] = useTransition();

  const runAction = useCallback(
    async (
      action: (input: {
        readonly shopName: string;
        readonly orderId: number;
      }) => Promise<
        { ok: true; whatsappUrl: string | null } | { ok: false; error: string }
      >,
      order: PlainPanelOrder,
    ) => {
      setIsBusy(true);
      try {
        const result = await action({ shopName, orderId: order.id });

        if (result.ok) {
          if (result.whatsappUrl) {
            window.open(result.whatsappUrl, "_blank");
          }
          startTransition(() => {
            router.refresh();
          });
        }
      } finally {
        setIsBusy(false);
      }
    },
    [shopName, router],
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
