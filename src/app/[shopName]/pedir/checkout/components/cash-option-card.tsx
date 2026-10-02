"use client";

import { Banknote } from "lucide-react";

import { PaymentMethod } from "@/domain/entities/payment-method.enum";

import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";
import { CashAmountOptions } from "./cash-amount-options";
import { HiddenPaymentRadio } from "./hidden-payment-radio";
import { ringClass } from "./payment-card-classes";
import { PAYMENT_OPTION_IDS } from "./payment-option-ids";
import {
  CASH_OPTION_DESCRIPTION,
  CASH_OPTION_LABEL,
} from "./payment-section-labels";

export type CashOptionCardProps = {
  readonly selected: boolean;
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function CashOptionCard({ selected, onChange }: CashOptionCardProps) {
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
            {CASH_OPTION_LABEL}
          </span>
          <p className="text-[12px] text-muted-foreground">
            {CASH_OPTION_DESCRIPTION}
          </p>
        </div>
        <HiddenPaymentRadio
          inputId={PAYMENT_OPTION_IDS.efectivoInputId}
          value={PaymentMethod.Efectivo}
          checked={selected}
          onChange={onChange}
        />
      </div>
      {selected && <CashAmountOptions />}
    </label>
  );
}
