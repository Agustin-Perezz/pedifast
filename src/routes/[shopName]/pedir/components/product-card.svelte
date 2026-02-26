<script lang="ts">
  import { cart } from '$lib/cart.svelte';
  import type { Product } from '$lib/types/product';
  import { formatPrice } from '$lib/utils';
  import PillQuantityControl from './pill-quantity-control.svelte';

  interface Props {
    product: Product;
    shopName: string;
  }

  let { product, shopName }: Props = $props();

  let quantity = $derived(cart.getQuantity(product.id));

  function handleAdd() {
    cart.add(product);
    navigator.vibrate?.(10);
  }

  function handleRemove() {
    cart.remove(product.id);
  }
</script>

<div class="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl bg-white">
  <a href="/{shopName}/pedir/{product.id}" tabindex="-1">
    <img
      src={product.images[0] ?? ''}
      alt={product.name}
      class="aspect-[4/3] w-full object-cover"
      loading="lazy"
    />
  </a>
  <div class="flex flex-col gap-2 p-3">
    <a
      href="/{shopName}/pedir/{product.id}"
      class="line-clamp-2 text-sm leading-snug font-semibold text-zinc-900"
    >
      {product.name}
    </a>
    {#if product.description}
      <p class="line-clamp-2 text-xs leading-snug text-zinc-400">
        {product.description}
      </p>
    {/if}
    <div class="flex items-center justify-between">
      <p class="text-sm font-bold text-zinc-900">
        {formatPrice(product.price)}
      </p>
      <PillQuantityControl
        {quantity}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
    </div>
  </div>
</div>
