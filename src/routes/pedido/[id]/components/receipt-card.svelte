<script lang="ts">
  import Receipt from '@lucide/svelte/icons/receipt';

  import { formatPrice } from '$lib/utils';

  interface Props {
    id: string;
    nombre: string;
    date: Date;
    notas?: string;
    items: Array<{ name: string; quantity: number; unitPrice: number }>;
    total: number;
  }

  let { id, nombre, date, notas, items, total }: Props = $props();

  function formatDate(d: Date): string {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(d);
  }
</script>

<div class="flex flex-col gap-4 rounded-lg border border-zinc-200 p-4">
  <div class="flex items-center gap-2 border-b border-zinc-100 pb-3">
    <Receipt class="h-4 w-4 text-zinc-500" />
    <span class="text-xs font-semibold tracking-wider text-zinc-500 uppercase"
      >Recibo</span
    >
  </div>

  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <span class="text-xs text-zinc-500">Pedido</span>
      <span class="font-mono text-xs text-zinc-950">{id}</span>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-xs text-zinc-500">Nombre</span>
      <span class="text-xs text-zinc-950">{nombre}</span>
    </div>
    <div class="flex items-center justify-between">
      <span class="text-xs text-zinc-500">Fecha</span>
      <span class="text-xs text-zinc-950">{formatDate(date)}</span>
    </div>
    {#if notas}
      <div class="flex items-start justify-between gap-4">
        <span class="text-xs text-zinc-500">Notas</span>
        <span class="text-right text-xs text-zinc-950">{notas}</span>
      </div>
    {/if}
  </div>

  <div class="flex flex-col gap-2 border-t border-zinc-100 pt-3">
    {#each items as item (item.name)}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs text-zinc-500">{item.quantity}x</span>
          <span class="text-sm text-zinc-950">{item.name}</span>
        </div>
        <span class="font-mono text-sm text-zinc-950">
          {formatPrice(item.unitPrice * item.quantity)}
        </span>
      </div>
    {/each}
  </div>

  <div class="flex items-center justify-between border-t border-zinc-200 pt-3">
    <span class="text-sm font-semibold text-zinc-950">Total</span>
    <span class="font-mono text-base font-semibold text-zinc-950">
      {formatPrice(total)}
    </span>
  </div>
</div>
