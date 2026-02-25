import type { Component } from 'svelte';
import { page } from '$app/state';
import CircleCheck from '@lucide/svelte/icons/circle-check';
import CircleX from '@lucide/svelte/icons/circle-x';
import LoaderCircle from '@lucide/svelte/icons/loader-circle';

import { MercadoPagoPaymentStatus, PaymentMethod } from '$lib/schemas/order';
import {
  buildWhatsappMessage,
  buildWhatsappUrl,
  type PendingWhatsappOrder
} from '$lib/whatsapp';

interface StatusConfig {
  icon: Component<{ class?: string }>;
  spinning: boolean;
  title: string;
  badge: string;
  iconBg: string;
  iconColor: string;
  badgeClass: string;
}

export function createOrderPageState() {
  const id = $derived(page.params.id);
  const status = $derived(
    page.url.searchParams.get('status') ??
      page.url.searchParams.get('collection_status')
  );
  const paymentId = $derived(page.url.searchParams.get('payment_id'));

  let order = $state<PendingWhatsappOrder | null>(null);

  const orderDate = $derived.by(() => {
    const parts = id.split('-');
    const ts = parseInt(parts[parts.length - 1]);
    return isNaN(ts) ? new Date() : new Date(ts);
  });

  const backUrl = $derived(order ? `/${order.shopName}/pedir` : '/');

  const isConfirmed = $derived(
    status === PaymentMethod.enum.efectivo ||
      status === MercadoPagoPaymentStatus.approved
  );

  const whatsappUrl = $derived.by(() => {
    if (!isConfirmed || !order) return null;
    const message = buildWhatsappMessage(order);
    return buildWhatsappUrl(order.whatsappPhone, message);
  });

  $effect(() => {
    const stored = sessionStorage.getItem(`order-${id}`);
    if (!stored) {
      order = null;
      return;
    }
    try {
      order = JSON.parse(stored);
    } catch {
      order = null;
    }
  });

  $effect(() => {
    if (!whatsappUrl) return;
    const orderId = id;
    window.open(whatsappUrl, '_blank');
    sessionStorage.removeItem(`order-${orderId}`);
  });

  const statusConfig = $derived.by((): StatusConfig => {
    switch (status) {
      case MercadoPagoPaymentStatus.approved:
        return {
          icon: CircleCheck,
          spinning: false,
          title: 'Pago Verificado',
          badge: 'Mercado Pago',
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-500',
          badgeClass: 'bg-emerald-50 text-emerald-700'
        };
      case PaymentMethod.enum.efectivo:
        return {
          icon: CircleCheck,
          spinning: false,
          title: 'Pedido Confirmado',
          badge: 'Pago en efectivo',
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-500',
          badgeClass: 'bg-emerald-50 text-emerald-700'
        };
      case MercadoPagoPaymentStatus.rejected:
        return {
          icon: CircleX,
          spinning: false,
          title: 'Pago Rechazado',
          badge: 'Rechazado',
          iconBg: 'bg-red-50',
          iconColor: 'text-red-500',
          badgeClass: 'bg-red-50 text-red-700'
        };
      default:
        return {
          icon: LoaderCircle,
          spinning: true,
          title: 'Procesando...',
          badge: 'Verificando pago',
          iconBg: 'bg-zinc-100',
          iconColor: 'text-zinc-500',
          badgeClass: 'bg-zinc-100 text-zinc-700'
        };
    }
  });

  return {
    get id() {
      return id;
    },
    get paymentId() {
      return paymentId;
    },
    get order() {
      return order;
    },
    get orderDate() {
      return orderDate;
    },
    get backUrl() {
      return backUrl;
    },
    get isConfirmed() {
      return isConfirmed;
    },
    get whatsappUrl() {
      return whatsappUrl;
    },
    get statusConfig() {
      return statusConfig;
    }
  };
}
