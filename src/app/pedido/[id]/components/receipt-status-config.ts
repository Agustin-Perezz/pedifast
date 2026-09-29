import type { VerifiedPaymentStatus } from "@/application/use-cases/verify-mp-payment/verify-mp-payment.response.dto";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";
import { PaymentStatus } from "@/domain/entities/payment-status.enum";

export type ReceiptStatusConfig = {
  readonly title: string;
  readonly badge: string;
  readonly icon: "approved" | "rejected" | "processing";
  readonly iconBg: string;
  readonly iconColor: string;
  readonly badgeClass: string;
};

export const STATUS_CONFIG: Record<VerifiedPaymentStatus, ReceiptStatusConfig> =
  {
    [PaymentStatus.Approved]: {
      title: "Pago Verificado",
      badge: "Mercado Pago",
      icon: "approved",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      badgeClass: "bg-emerald-50 text-emerald-700",
    },
    [PaymentMethod.Efectivo]: {
      title: "Pedido Confirmado",
      badge: "Pago en efectivo",
      icon: "approved",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      badgeClass: "bg-emerald-50 text-emerald-700",
    },
    [PaymentStatus.Rejected]: {
      title: "Pago Rechazado",
      badge: "Rechazado",
      icon: "rejected",
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      badgeClass: "bg-red-50 text-red-700",
    },
    [PaymentStatus.Pending]: {
      title: "Procesando...",
      badge: "Verificando pago",
      icon: "processing",
      iconBg: "bg-zinc-100",
      iconColor: "text-zinc-500",
      badgeClass: "bg-zinc-100 text-zinc-700",
    },
  };
