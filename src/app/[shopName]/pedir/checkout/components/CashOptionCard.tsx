"use client";

import { Banknote } from "lucide-react";

import { PaymentMethod } from "@/domain/entities/payment-method.enum";

import type { PatchCheckoutForm } from "../hooks/useCheckoutScreen";
import { CashAmountOptions } from "./CashAmountOptions";
import { HiddenPaymentRadio } from "./HiddenPaymentRadio";
import { ringClass } from "./payment-card-classes";
import { PAYMENT_OPTION_IDS } from "./payment-option-ids";

export type CashOptionCardProps = {
  readonly selected: boolean;
  readonly isPickup: boolean;
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function CashOptionCard({
  selected,
  isPickup,
  onChange,
}: CashOptionCardProps) {
  const description = isPickup
    ? "Pagás al retirar en el local"
    : "Pagás en mano al repartidor";

  return (
    <label
      className={`flex cursor-pointer flex-col gap-2 rounded-xl bg-card p-4 shadow-sm ${ringClass(selected)}`}
      data-testid={PAYMENT_OPTION_IDS.efectivoTestId}
      htmlFor={PAYMENT_OPTION_IDS.efectivoInputId}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-container">
          <Banknote aria-hidden="true" className="size-5 text-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <span className="text-[15px] font-bold text-foreground">
            {isPickup ? "Efectivo al retirar" : "Efectivo al recibir"}
          </span>
          <p className="text-[12px] text-muted-foreground">{description}</p>
        </div>
        <HiddenPaymentRadio
          inputId={PAYMENT_OPTION_IDS.efectivoInputId}
          value={PaymentMethod.Efectivo}
          checked={selected}
          onChange={onChange}
          ariaLabel={isPickup ? "Efectivo al retirar" : "Efectivo al recibir"}
        />
      </div>
      {selected && <CashAmountOptions />}
    </label>
  );
}
