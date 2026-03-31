<script lang="ts">
  import { DeliveryMethod } from '$lib/schemas/order';
  import type { Order } from '$lib/types/order';

  interface Props {
    order: Order;
  }

  const { order }: Props = $props();

  const createdDate = $derived(
    new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(order.createdAt))
  );

  const isDelivery = $derived(
    order.deliveryMethod === DeliveryMethod.enum.delivery
  );
</script>

<div
  class="hidden print:fixed print:top-0 print:left-0 print:block print:w-[80mm] print:bg-white print:p-[4mm] print:font-mono print:text-xs print:text-black"
>
  <h1 class="mb-0.5 text-center text-lg font-bold">COMANDA</h1>
  <p class="m-0 text-center text-[11px] text-gray-700">{createdDate}</p>
  <p class="m-0 text-center text-[11px] text-gray-700">
    #{order.externalReference}
  </p>

  <hr class="my-1.5 border-0 border-t border-dashed border-black" />

  <p class="m-0 text-[13px] font-bold">{order.customerName}</p>
  {#if order.customerPhone}
    <p class="my-0.5 text-[11px]">Tel: {order.customerPhone}</p>
  {/if}

  {#if isDelivery}
    <p class="my-0.5 text-[11px]">ENVIO: {order.address ?? ''}</p>
  {:else}
    <p class="my-0.5 text-[11px]">RETIRO EN LOCAL</p>
  {/if}

  <hr class="my-1.5 border-0 border-t border-dashed border-black" />

  {#each order.items as item, i (i)}
    <div class="my-0.5 flex gap-1.5 text-[13px]">
      <span class="min-w-6 font-bold">{item.quantity}x</span>
      <span>{item.name}</span>
    </div>
    {#if item.accessories?.length}
      {#each item.accessories as acc, j (j)}
        <p class="m-0 ml-7 text-[11px] text-gray-700">+ {acc.name}</p>
      {/each}
    {/if}
  {/each}

  <hr class="my-1.5 border-0 border-t border-dashed border-black" />

  {#if order.deliveryCost > 0}
    <div class="my-0.5 flex justify-between text-xs">
      <span>Envio</span>
      <span>${order.deliveryCost.toLocaleString('es-AR')}</span>
    </div>
  {/if}

  <div class="my-1 flex justify-between text-[15px] font-bold">
    <span>TOTAL</span>
    <span>${order.total.toLocaleString('es-AR')}</span>
  </div>

  {#if order.notes}
    <hr class="my-1.5 border-0 border-t border-dashed border-black" />
    <p class="m-0 text-[11px] italic">NOTAS: {order.notes}</p>
  {/if}
</div>

<style>
  @media print {
    @page {
      margin: 0;
    }

    :global(body *) {
      visibility: hidden !important;
    }

    div,
    div * {
      visibility: visible !important;
    }
  }
</style>
