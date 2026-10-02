"use client";

import { Wallet } from "lucide-react";

import { PaymentMethod } from "@/domain/entities/payment-method.enum";

import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";
import { HiddenPaymentRadio } from "./hidden-payment-radio";
import { MercadoPagoChipsRow } from "./mercadopago-chips-row";
import { ringClass } from "./payment-card-classes";
import { PAYMENT_OPTION_IDS } from "./payment-option-ids";

export type MercadoPagoOptionCardProps = {
  readonly selected: boolean;
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function MercadoPagoOptionCard({
  selected,
  onChange,
}: MercadoPagoOptionCardProps) {
  return (
    <label
      className={`flex cursor-pointer flex-col gap-2 rounded-xl bg-card p-4 shadow-sm ${ringClass(selected)}`}
      data-testid={PAYMENT_OPTION_IDS.mercadoPagoTestId}
      htmlFor={PAYMENT_OPTION_IDS.mercadoPagoInputId}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-container">
          <Wallet aria-hidden="true" className="size-5 text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-foreground">
              Mercado Pago
            </span>
            <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold text-on-secondary-container">
              Recomendado
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground">
            Dinero en cuenta, débito o crédito
          </p>
        </div>
        <HiddenPaymentRadio
          inputId={PAYMENT_OPTION_IDS.mercadoPagoInputId}
          value={PaymentMethod.MercadoPago}
          checked={selected}
          onChange={onChange}
        />
      </div>
      <MercadoPagoChipsRow />
    </label>
  );
}
