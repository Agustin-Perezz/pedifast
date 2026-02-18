<script lang="ts">
  import { page } from '$app/stores';
  import CircleCheck from '@lucide/svelte/icons/circle-check';
  import CircleX from '@lucide/svelte/icons/circle-x';
  import Clock from '@lucide/svelte/icons/clock';

  const status = $derived(
    $page.url.searchParams.get('status') ??
      $page.url.searchParams.get('collection_status')
  );
  const paymentId = $derived($page.url.searchParams.get('payment_id'));
  const externalReference = $derived(
    $page.url.searchParams.get('external_reference')
  );

  const statusConfig = $derived.by(() => {
    switch (status) {
      case 'approved':
        return {
          icon: CircleCheck,
          title: 'Pago aprobado',
          description: 'Tu pedido fue confirmado correctamente.',
          color: 'text-green-600'
        };
      case 'rejected':
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
  </div>
</div>
