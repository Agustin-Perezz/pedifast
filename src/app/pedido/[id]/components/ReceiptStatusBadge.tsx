import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import type { VerifiedPaymentStatus } from "@/application/use-cases/verify-mp-payment/verify-mp-payment.response.dto";
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "./receipt-status-config";

type ReceiptStatusBadgeProps = {
  readonly status: VerifiedPaymentStatus;
};

export function ReceiptStatusBadge({ status }: ReceiptStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${config.iconBg}`}
      >
        {config.icon === "approved" ? (
          <CircleCheck className={`h-6 w-6 ${config.iconColor}`} />
        ) : config.icon === "rejected" ? (
          <CircleX className={`h-6 w-6 ${config.iconColor}`} />
        ) : (
          <LoaderCircle
            className={`h-6 w-6 ${config.iconColor} animate-spin`}
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-semibold text-zinc-950">
          {config.title}
        </span>
        <Badge className={config.badgeClass}>{config.badge}</Badge>
      </div>
    </div>
  );
}
