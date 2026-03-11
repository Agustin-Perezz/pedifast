<script lang="ts">
  import { formatPrice } from '$lib/utils';

  interface Props {
    name: string;
    price: number;
    imageUrl: string | undefined;
    quantity: number;
  }

  let { name, price, imageUrl, quantity }: Props = $props();
</script>

<div class="flex items-center gap-3 rounded-lg bg-zinc-50 p-3">
  {#if imageUrl}
    <img
      src={imageUrl}
      alt={name}
      class="size-14 shrink-0 rounded-lg object-cover"
    />
  {/if}
  <div class="flex min-w-0 flex-col">
    <span class="truncate text-sm font-semibold">
      {name}
      {#if quantity > 1}
        <span class="text-zinc-400">x{quantity}</span>
      {/if}
    </span>
    <span class="text-sm text-zinc-500">
      {formatPrice(price)}
    </span>
  </div>
</div>
