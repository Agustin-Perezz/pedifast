import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import type { CheckoutFormState } from "../../hooks/useCheckoutForm";

export function dockTotal(totalPrice: number, form: CheckoutFormState): number {
  const isDelivery = form.deliveryMethod === DeliveryMethod.Delivery;
  const cost = isDelivery && form.deliveryCost !== null ? form.deliveryCost : 0;

  return totalPrice + cost;
}
