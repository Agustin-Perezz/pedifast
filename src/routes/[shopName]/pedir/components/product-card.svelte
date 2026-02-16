<script lang="ts">
  import { Button } from '$components/ui/button';

  import { cart } from '$lib/cart.svelte';
  import type { Product } from '$lib/types/product';
  import { formatPrice } from '$lib/utils';
  import QuantityControl from './quantity-control.svelte';

  interface Props {
    product: Product;
  }

  let { product }: Props = $props();

  let quantity = $derived(cart.getQuantity(product.id));

  function handleAdd() {
    cart.add(product);
    navigator.vibrate?.(10);
  }
</script>

<div class="flex flex-col gap-2">
  <div class="overflow-hidden rounded-lg border border-zinc-200">
    <img
      src={product.image}
      alt={product.name}
      class="aspect-square w-full object-cover"
      loading="lazy"
    />
  </div>
  <div class="flex flex-col gap-1">
    <p class="text-sm font-medium text-zinc-950">{product.name}</p>
    <p class="font-mono text-sm text-zinc-500">{formatPrice(product.price)}</p>
  </div>
  {#if quantity > 0}
    <QuantityControl
      {quantity}
      onIncrement={() => cart.add(product)}
      onDecrement={() => cart.remove(product.id)}
    />
  {:else}
    <Button
      variant="outline"
      class="min-h-[44px] w-full rounded-lg"
      onclick={handleAdd}
    >
      Agregar
    </Button>
  {/if}
</div>
