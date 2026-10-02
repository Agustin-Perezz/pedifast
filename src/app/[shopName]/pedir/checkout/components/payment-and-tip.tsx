"use client";

import type { CheckoutFormState } from "../../components/checkout/use-checkout-form";
import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";
import { PaymentSection } from "./payment-section";
import { TipSection } from "./tip-section";

export type PaymentAndTipProps = {
  readonly paymentMethod: CheckoutFormState["paymentMethod"];
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function PaymentAndTip({ paymentMethod, onChange }: PaymentAndTipProps) {
  return (
    <>
      <PaymentSection paymentMethod={paymentMethod} onChange={onChange} />
      <TipSection />
    </>
  );
}
