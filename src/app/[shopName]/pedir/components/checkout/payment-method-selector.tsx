"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { PaymentMethod } from "@/domain/entities/payment-method.enum";

const CASH_LABEL = "Efectivo";
const MP_LABEL = "MercadoPago";

type PaymentMethodSelectorProps = {
  readonly value: PaymentMethod;
  readonly onChange: (paymentMethod: PaymentMethod) => void;
};

export function PaymentMethodSelector({
  value,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-2" data-testid="payment-method-section">
      <Label>Pago</Label>
      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as PaymentMethod)}
        className="flex gap-4"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem
            value={PaymentMethod.Efectivo}
            id="payment-efectivo"
          />
          <Label htmlFor="payment-efectivo">{CASH_LABEL}</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem
            value={PaymentMethod.MercadoPago}
            id="payment-mercadopago"
          />
          <Label htmlFor="payment-mercadopago">{MP_LABEL}</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
