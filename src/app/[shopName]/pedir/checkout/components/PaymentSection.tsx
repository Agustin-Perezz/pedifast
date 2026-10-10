"use client";

import { PaymentMethod } from "@/domain/entities/payment-method.enum";

import type { PatchCheckoutForm } from "../hooks/useCheckoutScreen";
import { CashOptionCard } from "./CashOptionCard";
import { MercadoPagoOptionCard } from "./MercadopagoOptionCard";
import { PaymentProtectedBadge } from "./PaymentProtectedBadge";

export type PaymentSectionProps = {
  readonly paymentMethod: PaymentMethod;
  readonly isPickup: boolean;
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function PaymentSection({
  paymentMethod,
  isPickup,
  onChange,
}: PaymentSectionProps) {
  const isMercadoPago = paymentMethod === PaymentMethod.MercadoPago;
  const isEfectivo = paymentMethod === PaymentMethod.Efectivo;

  return (
    <section className="mt-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">
          Método de pago
        </h3>
        <PaymentProtectedBadge />
      </div>
      <MercadoPagoOptionCard selected={isMercadoPago} onChange={onChange} />
      <CashOptionCard
        selected={isEfectivo}
        isPickup={isPickup}
        onChange={onChange}
      />
    </section>
  );
}
