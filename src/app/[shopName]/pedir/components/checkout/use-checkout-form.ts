"use client";

import { useState } from "react";

import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";

export type CheckoutFormState = {
  readonly nombre: string;
  readonly telefono: string;
  readonly notas: string;
  readonly deliveryMethod: DeliveryMethod;
  readonly address: string;
  readonly paymentMethod: PaymentMethod;
  readonly deliveryCost: number | null;
};

const INITIAL_STATE: CheckoutFormState = {
  nombre: "",
  telefono: "",
  notas: "",
  deliveryMethod: DeliveryMethod.Pickup,
  address: "",
  paymentMethod: PaymentMethod.Efectivo,
  deliveryCost: null,
};

type UseCheckoutFormResult = {
  readonly form: CheckoutFormState;
  readonly update: (patch: Partial<CheckoutFormState>) => void;
  readonly error: string | null;
  readonly submitting: boolean;
  readonly setError: (error: string | null) => void;
  readonly setSubmitting: (submitting: boolean) => void;
};

export function useCheckoutForm(): UseCheckoutFormResult {
  const [form, setForm] = useState<CheckoutFormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (patch: Partial<CheckoutFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  return { form, update, error, submitting, setError, setSubmitting };
}
