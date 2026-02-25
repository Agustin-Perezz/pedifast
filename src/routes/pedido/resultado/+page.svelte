<script lang="ts">
  import { page } from '$app/stores';
  import CircleCheck from '@lucide/svelte/icons/circle-check';
  import CircleX from '@lucide/svelte/icons/circle-x';
  import Clock from '@lucide/svelte/icons/clock';

  import { MercadoPagoPaymentStatus, PaymentMethod } from '$lib/schemas/order';
  import {
    buildWhatsappMessage,
    buildWhatsappUrl,
    PENDING_WHATSAPP_KEY,
    type PendingWhatsappOrder
  } from '$lib/whatsapp';

  const status = $derived(
    $page.url.searchParams.get('status') ??
      $page.url.searchParams.get('collection_status')
  );
  const paymentId = $derived($page.url.searchParams.get('payment_id'));
  const externalReference = $derived(
    $page.url.searchParams.get('external_reference')
  );

  let whatsappUrl = $state<string | null>(null);

  const isConfirmed = $derived(
    status === PaymentMethod.enum.efectivo ||
      status === MercadoPagoPaymentStatus.approved
  );

  $effect(() => {
    if (!isConfirmed) return;

    const raw = sessionStorage.getItem(PENDING_WHATSAPP_KEY);
    if (!raw) return;

    try {
      const order: PendingWhatsappOrder = JSON.parse(raw);
      const message = buildWhatsappMessage(order);
      const url = buildWhatsappUrl(order.whatsappPhone, message);
      whatsappUrl = url;
      sessionStorage.removeItem(PENDING_WHATSAPP_KEY);
      window.open(url, '_blank');
    } catch {
      // If parsing fails, silently skip WhatsApp notification
    }
  });

  const statusConfig = $derived.by(() => {
    switch (status) {
      case MercadoPagoPaymentStatus.approved:
        return {
          icon: CircleCheck,
          title: 'Pago aprobado',
          description: 'Tu pedido fue confirmado correctamente.',
          color: 'text-green-600'
        };
      case PaymentMethod.enum.efectivo:
        return {
          icon: CircleCheck,
          title: 'Pedido confirmado',
          description:
            'Tu pedido fue recibido. Abonás en efectivo al momento de la entrega.',
          color: 'text-green-600'
        };
      case MercadoPagoPaymentStatus.rejected:
        return {
          icon: CircleX,
          title: 'Pago rechazado',
          description: 'No se pudo procesar el pago. Intentá nuevamente.',
          color: 'text-red-600'
        };
      default:
        return {
          icon: Clock,
          title: 'Pago pendiente',
          description:
            'Tu pago está siendo procesado. Te notificaremos cuando se confirme.',
          color: 'text-yellow-600'
        };
    }
  });
</script>

<div class="mx-auto max-w-md px-4 pt-16">
  <div class="flex flex-col items-center gap-4 text-center">
    <statusConfig.icon class="size-16 {statusConfig.color}" />
    <h1 class="text-2xl font-semibold text-zinc-950">{statusConfig.title}</h1>
    <p class="text-sm text-zinc-500">{statusConfig.description}</p>

    {#if paymentId}
      <p class="text-xs text-zinc-400">ID de pago: {paymentId}</p>
    {/if}

    {#if externalReference}
      <p class="text-xs text-zinc-400">Referencia: {externalReference}</p>
    {/if}

    {#if whatsappUrl && isConfirmed}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#25D366]/90"
      >
        Enviar pedido por WhatsApp
      </a>
    {/if}
  </div>
</div>
