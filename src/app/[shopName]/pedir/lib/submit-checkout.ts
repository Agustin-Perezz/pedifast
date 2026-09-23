import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { OrderExternalReference } from "@/domain/entities/order-external-reference";
import { OrderFlow } from "@/domain/entities/order-flow.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";

import { createOrderAction } from "../actions";
import type { CartContextValue } from "../CartProvider";
import { persistPendingWhatsappOrder } from "./order-storage";
import type { PlainShop } from "./serialize-shop";
import { buildWhatsappMessage, type PendingWhatsappOrder } from "./whatsapp";

const MP_INIT_POINT_TODO = "/pedido/{externalReference}";

type CheckoutFormSubmission = {
  readonly nombre: string;
  readonly telefono: string;
  readonly notas: string;
  readonly deliveryMethod: DeliveryMethod;
  readonly address: string;
  readonly paymentMethod: PaymentMethod;
  readonly deliveryCost: number | null;
};

type SubmitCheckoutResult = {
  readonly error: string | null;
};

export async function submitCheckout(
  shop: PlainShop,
  form: CheckoutFormSubmission,
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
  form: CheckoutFormSubmission,
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
  window.location.href = buildReceiptUrl(externalReference, form.paymentMethod);

  return { error: null };
}

async function submitDashboardOrder(
  shop: PlainShop,
  form: CheckoutFormSubmission,
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
  window.location.href = buildReceiptUrl(
    result.externalReference,
    form.paymentMethod,
  );

  return { error: null };
}

function serializeCartItems(cart: CartContextValue): readonly {
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly accessories: readonly {
    readonly name: string;
    readonly priceDelta: number;
  }[];
}[] {
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

function buildReceiptUrl(
  externalReference: string,
  paymentMethod: PaymentMethod,
): string {
  if (paymentMethod === PaymentMethod.Efectivo) {
    return `/pedido/${externalReference}?status=efectivo`;
  }

  return MP_INIT_POINT_TODO.replace("{externalReference}", externalReference);
}

export function buildPendingWhatsappMessage(
  order: PendingWhatsappOrder,
): string {
  return buildWhatsappMessage(order);
}
