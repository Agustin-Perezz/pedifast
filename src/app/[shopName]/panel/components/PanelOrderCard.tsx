"use client";

import { usePanelOrderActions } from "../hooks/usePanelOrderActions";
import type { PlainPanelOrder } from "../lib/serialize-panel-order";
import { ConfirmButton, PrintButton, RejectButton } from "./PanelOrderButtons";
import { PanelOrderSummary } from "./PanelOrderSummary";

type PanelOrderCardVariant = "pending" | "confirmed";

type PanelOrderCardProps = {
  readonly shopName: string;
  readonly order: PlainPanelOrder;
  readonly variant: PanelOrderCardVariant;
};

export function PanelOrderCard({
  shopName,
  order,
  variant,
}: PanelOrderCardProps) {
  const { confirm, reject, isBusy } = usePanelOrderActions(shopName);

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${
        variant === "pending"
          ? "border-l-4 border-l-amber-400 border-zinc-200"
          : "border-zinc-200"
      }`}
    >
      <PanelOrderSummary order={order} />
      {variant === "pending" ? (
        <div className="flex gap-2">
          <ConfirmButton onClick={() => confirm(order)} disabled={isBusy} />
          <RejectButton onClick={() => reject(order)} disabled={isBusy} />
        </div>
      ) : (
        <PrintButton />
      )}
    </div>
  );
}
