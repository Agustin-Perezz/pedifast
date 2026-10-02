"use client";

import { PaymentMethod } from "@/domain/entities/payment-method.enum";
import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";
import { CASH_ARIA_LABEL, MP_ARIA_LABEL } from "./payment-radio-labels";

export type HiddenPaymentRadioProps = {
  readonly inputId: string;
  readonly value: PaymentMethod;
  readonly checked: boolean;
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function HiddenPaymentRadio({
  inputId,
  value,
  checked,
  onChange,
}: HiddenPaymentRadioProps) {
  return (
    <input
      id={inputId}
      type="radio"
      name="paymentMethod"
      value={value}
      checked={checked}
      onChange={() => onChange({ paymentMethod: value })}
      className="size-5 shrink-0 accent-primary"
      aria-label={labelFor(value)}
    />
  );
}

function labelFor(value: PaymentMethod): string {
  if (value === PaymentMethod.Efectivo) {
    return CASH_ARIA_LABEL;
  }

  return MP_ARIA_LABEL;
}
