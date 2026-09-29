"use client";

import type { VerifiedPaymentStatus } from "@/application/use-cases/verify-mp-payment/verify-mp-payment.response.dto";
import { useReceiptState } from "../hooks/useReceiptState";
import { ReceiptDashboardStatus } from "./ReceiptDashboardStatus";
import { ReceiptNotFound } from "./ReceiptNotFound";
import { ReceiptOrderDetails } from "./ReceiptOrderDetails";
import { ReceiptShell } from "./ReceiptShell";

type ReceiptViewProps = {
  readonly orderId: string;
  readonly verifiedStatus: VerifiedPaymentStatus;
  readonly paymentId: string | null;
  readonly isDashboardFlow: boolean;
};

export function ReceiptView({
  orderId,
  verifiedStatus,
  paymentId,
  isDashboardFlow,
}: ReceiptViewProps) {
  const state = useReceiptState({ orderId, verifiedStatus, isDashboardFlow });

  if (isDashboardFlow) {
    return (
      <ReceiptShell title={verifiedStatus} backUrl={state.backUrl}>
        <ReceiptDashboardStatus
          status={verifiedStatus}
          orderId={orderId}
          paymentId={paymentId}
          backUrl={state.backUrl}
        />
      </ReceiptShell>
    );
  }

  if (!state.order) {
    return (
      <ReceiptShell title="Pedido" backUrl={state.backUrl}>
        <ReceiptNotFound backUrl={state.backUrl} />
      </ReceiptShell>
    );
  }

  return (
    <ReceiptShell title={verifiedStatus} backUrl={state.backUrl}>
      <ReceiptOrderDetails
        order={state.order}
        orderId={orderId}
        orderDate={state.orderDate}
        paymentId={paymentId}
        whatsappUrl={state.whatsappUrl}
        isConfirmed={state.isConfirmed}
        backUrl={state.backUrl}
      />
    </ReceiptShell>
  );
}
