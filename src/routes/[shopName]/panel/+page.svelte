<script lang="ts">
  import type { Order } from '$lib/types/order';
  import {
    buildCustomerConfirmationMessage,
    buildWhatsappUrl
  } from '$lib/whatsapp';
  import EmptyState from './components/empty-state.svelte';
  import OrderList from './components/order-list.svelte';
  import PrintableTicket from './components/printable-ticket.svelte';
  import { DashboardState } from './page.state.svelte';

  const { data } = $props();
  const dashboard = $derived(new DashboardState(data.orders));

  let printingOrder = $state<Order | null>(null);

  $effect(() => {
    dashboard.connect(data.shopId);
    return () => {
      dashboard.disconnect();
    };
  });

  function handlePrint(order: Order) {
    printingOrder = order;
    requestAnimationFrame(() => {
      window.print();
    });
  }

  function handleConfirmed(order: Order) {
    if (order.customerPhone) {
      const message = buildCustomerConfirmationMessage(order);
      const url = buildWhatsappUrl(order.customerPhone, message);
      window.open(url, '_blank');
    }
  }
</script>

<div class="min-h-screen bg-zinc-50 print:hidden">
  <header class="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-4">
    <div class="mx-auto flex max-w-2xl items-center justify-between">
      <h1 class="text-lg font-semibold text-zinc-950">Panel de pedidos</h1>
    </div>
  </header>

  <main class="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-6">
    {#if dashboard.pendingOrders.length === 0 && dashboard.confirmedOrders.length === 0}
      <EmptyState />
    {:else}
      <OrderList
        title="Pendientes"
        orders={dashboard.pendingOrders}
        onPrint={handlePrint}
        onConfirmed={handleConfirmed}
      />
      <OrderList
        title="Confirmados"
        orders={dashboard.confirmedOrders}
        onPrint={handlePrint}
      />
    {/if}
  </main>
</div>

{#if printingOrder}
  <PrintableTicket order={printingOrder} />
{/if}
