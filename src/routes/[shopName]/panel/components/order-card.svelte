<script lang="ts">
  import { enhance } from '$app/forms';
  import Check from '@lucide/svelte/icons/check';
  import Printer from '@lucide/svelte/icons/printer';
  import X from '@lucide/svelte/icons/x';

  import { DeliveryMethod, OrderStatus } from '$lib/schemas/order';
  import type { Order } from '$lib/types/order';

  interface Props {
    order: Order;
    onPrint: (order: Order) => void;
    onConfirmed?: (order: Order) => void;
  }

  const { order, onPrint, onConfirmed }: Props = $props();

  const isPending = $derived(order.status === OrderStatus.enum.pending);
  const isDelivery = $derived(
    order.deliveryMethod === DeliveryMethod.enum.delivery
  );

  const createdDate = $derived(
    new Intl.DateTimeFormat('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(order.createdAt))
  );

  const totalFormatted = $derived(
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(order.total)
  );
</script>

<div
  class="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all {isPending
    ? 'border-l-4 border-l-amber-400'
    : ''}"
>
  <div class="mb-3 flex items-start justify-between">
    <div>
      <p class="text-sm font-semibold text-zinc-950">{order.customerName}</p>
      <p class="text-xs text-zinc-500">{createdDate}</p>
    </div>
    <span
      class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
        {isPending
        ? 'bg-amber-50 text-amber-700'
        : order.status === OrderStatus.enum.confirmed
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-red-50 text-red-700'}"
    >
      {isPending
        ? 'Pendiente'
        : order.status === OrderStatus.enum.confirmed
          ? 'Confirmado'
          : 'Rechazado'}
    </span>
  </div>

  <div class="mb-3 space-y-1">
    {#each order.items as item (item.name)}
      <div class="flex justify-between text-sm">
        <span class="text-zinc-700">
          {item.quantity}x {item.name}
        </span>
        <span class="text-zinc-500">
          {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
          }).format(item.unitPrice * item.quantity)}
        </span>
      </div>
      {#if item.accessories?.length}
        {#each item.accessories as acc (acc.name)}
          <p class="pl-4 text-xs text-zinc-400">+ {acc.name}</p>
        {/each}
      {/if}
    {/each}
  </div>

  {#if isDelivery && order.address}
    <p class="mb-2 text-xs text-zinc-500">
      Envio: {order.address}
    </p>
  {/if}

  {#if order.notes}
    <p class="mb-2 text-xs text-zinc-500 italic">"{order.notes}"</p>
  {/if}

  <div class="mb-3 flex justify-between border-t border-zinc-100 pt-2">
    <span class="text-sm font-medium text-zinc-950">Total</span>
    <span class="text-sm font-semibold text-zinc-950">{totalFormatted}</span>
  </div>

  {#if isPending}
    <div class="flex gap-2">
      <form
        method="POST"
        action="?/confirm"
        use:enhance={() => {
          return async ({ result, update }) => {
            if (
              result.type === 'success' &&
              result.data?.order &&
              onConfirmed
            ) {
              onConfirmed(result.data.order as Order);
            }
            await update();
          };
        }}
        class="flex-1"
      >
        <input type="hidden" name="orderId" value={order.id} />
        <button
          type="submit"
          class="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          <Check class="h-4 w-4" />
          Confirmar
        </button>
      </form>
      <form method="POST" action="?/reject" use:enhance class="flex-1">
        <input type="hidden" name="orderId" value={order.id} />
        <button
          type="submit"
          class="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          <X class="h-4 w-4" />
          Rechazar
        </button>
      </form>
    </div>
  {:else}
    <button
      type="button"
      onclick={() => onPrint(order)}
      class="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
    >
      <Printer class="h-4 w-4" />
      Imprimir comanda
    </button>
  {/if}
</div>
