import type { CheckoutFormState } from "../../components/checkout/use-checkout-form";

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
