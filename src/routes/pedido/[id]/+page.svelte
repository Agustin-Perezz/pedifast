<script lang="ts">
  import { page } from '$app/stores';

  import type { OrderSummary } from '$lib/types/product';
  import ReceiptCard from './components/receipt-card.svelte';
  import StatusBadge from './components/status-badge.svelte';

  let order = $state<OrderSummary | null>(null);

  $effect(() => {
    const id = $page.params.id;
    const stored = sessionStorage.getItem(`order-${id}`);
    if (stored) {
      order = JSON.parse(stored);
    }
  });
</script>

<div class="mx-auto max-w-md px-4 pt-6">
  {#if order}
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold text-zinc-950">Pedido confirmado</h1>
        <p class="text-sm text-zinc-500">Gracias, {order.nombre}.</p>
        <StatusBadge />
      </div>

      <ReceiptCard {order} />
    </div>
  {:else}
    <div class="flex flex-col items-center gap-2 pt-20">
      <p class="text-zinc-500">Pedido no encontrado</p>
    </div>
  {/if}
</div>
