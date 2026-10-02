import { CHECKOUT_FIELD_ELEMENT_IDS } from "../components/checkout-field-ids";
import type { CheckoutFieldError } from "./submit-checkout";

export function scrollToCheckoutField(field: CheckoutFieldError): void {
  const elementId = CHECKOUT_FIELD_ELEMENT_IDS[field];
  document.getElementById(elementId)?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}
