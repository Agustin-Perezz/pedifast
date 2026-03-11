<script lang="ts">
  import { cart } from '$lib/cart.svelte';
  import { formatPrice } from '$lib/utils';
</script>

<div class="flex flex-col gap-4">
  <span class="text-xs font-semibold tracking-wide text-zinc-500">RESUMEN</span>
  <div class="rounded-lg border border-zinc-200 px-4 py-3">
    {#each cart.items as item (item.product.id)}
      <div class="flex items-center justify-between py-1 text-sm">
        <span>
          <span class="text-zinc-500">{item.quantity}x</span>
          {item.product.name}
        </span>
        <span class="font-mono font-medium text-zinc-900">
          {formatPrice(cart.getItemUnitPrice(item) * item.quantity)}
        </span>
      </div>
      {#if item.selectedAccessories.length > 0}
        <div class="ml-6 flex flex-col gap-0.5 pb-1">
          {#each item.selectedAccessories as acc (acc.optionId)}
            <span class="text-xs text-zinc-500">
              └ {acc.optionName}
              {#if acc.priceDelta > 0}
                <span class="text-zinc-400">
                  (+{formatPrice(acc.priceDelta)})
                </span>
              {/if}
            </span>
          {/each}
        </div>
      {/if}
    {/each}
    <div
      class="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2 text-sm"
    >
      <span class="font-semibold text-zinc-900">Total</span>
      <span class="font-mono font-semibold text-zinc-900">
        {formatPrice(cart.totalPrice)}
      </span>
    </div>
  </div>
</div>
