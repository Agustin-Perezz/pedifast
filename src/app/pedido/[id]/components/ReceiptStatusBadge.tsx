import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ReceiptStatusConfig = {
  readonly title: string;
  readonly badge: string;
  readonly icon: "approved" | "rejected" | "processing";
  readonly iconBg: string;
  readonly iconColor: string;
  readonly badgeClass: string;
};

const STATUS_CONFIG: Record<string, ReceiptStatusConfig> = {
  approved: {
    title: "Pago Verificado",
    badge: "Mercado Pago",
    icon: "approved",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  efectivo: {
    title: "Pedido Confirmado",
    badge: "Pago en efectivo",
    icon: "approved",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  rejected: {
    title: "Pago Rechazado",
    badge: "Rechazado",
    icon: "rejected",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    badgeClass: "bg-red-50 text-red-700",
  },
};

const DEFAULT_CONFIG: ReceiptStatusConfig = {
  title: "Procesando...",
  badge: "Verificando pago",
  icon: "processing",
  iconBg: "bg-zinc-100",
  iconColor: "text-zinc-500",
  badgeClass: "bg-zinc-100 text-zinc-700",
};

export function ReceiptStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? DEFAULT_CONFIG;

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
