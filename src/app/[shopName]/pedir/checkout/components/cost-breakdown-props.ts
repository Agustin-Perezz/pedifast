import type { CheckoutFormState } from "../../hooks/useCheckoutForm";

export type CheckoutScreenFormProps = {
  readonly form: CheckoutFormState;
  readonly update: (patch: Partial<CheckoutFormState>) => void;
};

export type CostBreakdownProps = {
  readonly totalItems: number;
  readonly itemsTotal: number;
  readonly deliveryCost: number | null;
  readonly showShipping: boolean;
};
