import type { CheckoutFieldError } from "../lib/submit-checkout";

export const CHECKOUT_FIELD_ELEMENT_IDS: Record<CheckoutFieldError, string> = {
  nombre: "checkout-nombre",
  telefono: "checkout-telefono",
  address: "checkout-address",
};
