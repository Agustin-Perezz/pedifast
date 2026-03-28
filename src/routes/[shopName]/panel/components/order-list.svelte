<script lang="ts">
  import type { Order } from '$lib/types/order';
  import OrderCard from './order-card.svelte';

  interface Props {
    title: string;
    orders: Order[];
    onPrint: (order: Order) => void;
    onConfirmed?: (order: Order) => void;
  }

  const { title, orders, onPrint, onConfirmed }: Props = $props();
</script>

{#if orders.length > 0}
  <section>
    <h2
      class="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase"
    >
      {title} ({orders.length})
    </h2>
    <div class="flex flex-col gap-3">
      {#each orders as order (order.id)}
        <OrderCard {order} {onPrint} {onConfirmed} />
      {/each}
    </div>
  </section>
{/if}
