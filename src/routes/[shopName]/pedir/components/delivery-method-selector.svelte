<script lang="ts">
  import MapPin from '@lucide/svelte/icons/map-pin';

  import { DeliveryMethod, type DeliveryMethodValue } from '$lib/schemas/order';

  interface Props {
    deliveryMethod: DeliveryMethodValue;
    onSelect: (method: DeliveryMethodValue) => void;
    address: string | null;
    deliveryPrice: number | null;
  }

  let { deliveryMethod, onSelect, address, deliveryPrice }: Props = $props();
</script>

<div class="flex flex-col gap-2">
  <span class="text-sm font-medium">Método de entrega</span>

  <button
    type="button"
    onclick={() => onSelect(DeliveryMethod.enum.pickup)}
    class="flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors
      {deliveryMethod === DeliveryMethod.enum.pickup
      ? 'border-zinc-900'
      : 'border-zinc-200 hover:border-zinc-300'}"
  >
    <span class="mt-0.5 text-base leading-none">
      {deliveryMethod === DeliveryMethod.enum.pickup ? '●' : '○'}
    </span>
    <div class="flex flex-col gap-0.5">
      <span class="font-medium">Retiro en local</span>
      {#if address}
        <span class="flex items-center gap-1 text-xs text-zinc-500">
          <MapPin class="size-3 shrink-0" />
          {address}
        </span>
      {/if}
    </div>
  </button>

  <button
    type="button"
    onclick={() => onSelect(DeliveryMethod.enum.delivery)}
    class="flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors
      {deliveryMethod === DeliveryMethod.enum.delivery
      ? 'border-zinc-900'
      : 'border-zinc-200 hover:border-zinc-300'}"
  >
    <span class="mt-0.5 text-base leading-none">
      {deliveryMethod === DeliveryMethod.enum.delivery ? '●' : '○'}
    </span>
    <div class="flex flex-col gap-0.5">
      <span class="font-medium">Envío a domicilio</span>
      <span class="text-xs text-zinc-500">
        {#if deliveryPrice != null}
          Costo: ${deliveryPrice.toLocaleString('es-AR')}
        {:else}
          Costo a consultar
        {/if}
      </span>
    </div>
  </button>
</div>
