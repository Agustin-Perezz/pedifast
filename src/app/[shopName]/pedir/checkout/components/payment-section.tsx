"use client";

import { PaymentMethod } from "@/domain/entities/payment-method.enum";

import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";
import { CashOptionCard } from "./cash-option-card";
import { MercadoPagoOptionCard } from "./mercadopago-option-card";
import { PaymentProtectedBadge } from "./payment-protected-badge";
import { PAYMENT_SECTION_TITLE } from "./section-titles";

export type PaymentSectionProps = {
  readonly paymentMethod: PaymentMethod;
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function PaymentSection({
  paymentMethod,
  onChange,
}: PaymentSectionProps) {
  const isMercadoPago = paymentMethod === PaymentMethod.MercadoPago;
  const isEfectivo = paymentMethod === PaymentMethod.Efectivo;

  return (
    <section className="mt-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">
          {PAYMENT_SECTION_TITLE}
        </h3>
        <PaymentProtectedBadge />
      </div>
      <MercadoPagoOptionCard selected={isMercadoPago} onChange={onChange} />
      <CashOptionCard selected={isEfectivo} onChange={onChange} />
    </section>
  );
}
