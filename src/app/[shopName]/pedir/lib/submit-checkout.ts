import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import type { OrderItemInput } from "@/domain/entities/order.entity";
import { OrderExternalReference } from "@/domain/entities/order-external-reference";
import { OrderFlow } from "@/domain/entities/order-flow.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";

import { createOrderAction } from "../actions";
import type { CheckoutFormState } from "../components/checkout/use-checkout-form";
import type { CartContextValue } from "../context/cart-context";
import { persistPendingWhatsappOrder } from "./order-storage";
import type { PlainShop } from "./serialize-shop";
import { buildWhatsappMessage, type PendingWhatsappOrder } from "./whatsapp";

const MP_PREFERENCE_API = "/api/mp/preference";

type SubmitCheckoutResult = {
  readonly error: string | null;
};

export async function submitCheckout(
  shop: PlainShop,
  form: CheckoutFormState,
  cart: CartContextValue,
): Promise<SubmitCheckoutResult> {
  if (form.nombre.length === 0) {
    return { error: "Ingresa tu nombre" };
  }

  if (
    shop.orderFlow === OrderFlow.Dashboard &&
    form.telefono.trim().length === 0
  ) {
    return { error: "Ingresa tu teléfono" };
  }

  if (
    form.deliveryMethod === DeliveryMethod.Delivery &&
    form.address.trim().length === 0
  ) {
    return { error: "Ingresa la dirección de envío" };
  }

  if (cart.isEmpty) {
    return { error: "Tu carrito está vacío" };
  }

  const deliveryCost = form.deliveryCost ?? 0;

  if (shop.orderFlow === OrderFlow.Whatsapp) {
    return submitWhatsappOrder(shop, form, cart, deliveryCost);
  }

  return submitDashboardOrder(shop, form, cart, deliveryCost);
}

async function submitWhatsappOrder(
  shop: PlainShop,
  form: CheckoutFormState,
  cart: CartContextValue,
  deliveryCost: number,
): Promise<SubmitCheckoutResult> {
  const externalReference = OrderExternalReference.generate(
    shop.shopName,
  ).toReference();

  persistPendingWhatsappOrder(window.localStorage, externalReference, {
    shopName: shop.shopName,
    whatsappPhone: shop.whatsappPhone,
    nombre: form.nombre,
    deliveryMethod: form.deliveryMethod,
    address: form.address || null,
    notas: form.notas || null,
    paymentMethod: form.paymentMethod,
    items: serializeCartItems(cart),
    total: cart.totalPrice + deliveryCost,
  });

  cart.clearCart();
  await redirectToPaymentOrReceipt(externalReference, form, cart);

  return { error: null };
}

async function submitDashboardOrder(
  shop: PlainShop,
  form: CheckoutFormState,
  cart: CartContextValue,
  deliveryCost: number,
): Promise<SubmitCheckoutResult> {
  const result = await createOrderAction({
    shopName: shop.shopName,
    payload: {
      customerName: form.nombre,
      customerPhone: form.telefono || null,
      notes: form.notas || null,
      deliveryMethod: form.deliveryMethod,
      address: form.address || null,
      paymentMethod: form.paymentMethod,
      items: serializeCartItems(cart),
      deliveryCost,
    },
  });

  if (!result.ok) {
    return { error: result.error };
  }

  cart.clearCart();
  await redirectToPaymentOrReceipt(result.externalReference, form, cart);

  return { error: null };
}

function serializeCartItems(cart: CartContextValue): readonly OrderItemInput[] {
  return cart.items.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    unitPrice: item.product.price,
    accessories: item.selectedAccessories.map((accessory) => ({
      name: accessory.name,
      priceDelta: accessory.priceDelta,
    })),
  }));
}

async function redirectToPaymentOrReceipt(
  externalReference: string,
  form: CheckoutFormState,
  cart: CartContextValue,
): Promise<void> {
  if (form.paymentMethod === PaymentMethod.Efectivo) {
    window.location.href = `/pedido/${externalReference}?status=efectivo`;
    return;
  }

  const response = await fetch(MP_PREFERENCE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shopName: externalReference.slice(0, externalReference.lastIndexOf("-")),
      nombre: form.nombre,
      notas: form.notas,
      deliveryMethod: form.deliveryMethod,
      address: form.address,
      items: serializeCartItems(cart).map((item) => ({
        title: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currencyId: "ARS",
      })),
      baseUrl: window.location.origin,
    }),
  });

  if (!response.ok) {
    window.location.href = `/pedido/${externalReference}?status=pending`;
    return;
  }

  const preference: { initPoint: string } = await response.json();
  window.location.href = preference.initPoint;
}

export function buildPendingWhatsappMessage(
  order: PendingWhatsappOrder,
): string {
  return buildWhatsappMessage(order);
}
