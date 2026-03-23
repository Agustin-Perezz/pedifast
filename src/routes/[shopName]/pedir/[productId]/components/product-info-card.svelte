<script lang="ts">
  import { CATEGORY_LABELS, type ShopItemCategory } from '$lib/types/product';
  import { formatPrice } from '$lib/utils';

  interface Props {
    name: string;
    category: ShopItemCategory;
    description: string | undefined;
    price: number;
    quantity: number;
    onAdd: () => void;
  }

  let { name, category, description, price, quantity, onAdd }: Props = $props();
</script>

<div
  class="z-10 -mt-2 flex-1 rounded-t-3xl bg-white px-6 pt-7 pb-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] shadow-slate-300 md:-mt-0 md:rounded-none md:px-0 md:shadow-none"
>
  <h1 class="text-2xl font-bold text-zinc-900 md:text-3xl">
    {name}
  </h1>
  <p class="mt-0.5 text-sm text-zinc-400 italic">
    {CATEGORY_LABELS[category]}
  </p>

  {#if description}
    <p class="mt-6 text-sm leading-relaxed text-zinc-400 md:text-base">
      {description}
    </p>
  {/if}

  <div class="mt-10 flex items-center justify-between">
    <span class="text-2xl font-bold text-zinc-900 md:text-3xl"
      >{formatPrice(price)}</span
    >
    <button
      onclick={onAdd}
      class="rounded-full border-2 border-zinc-800 px-6 py-2.5 text-sm font-bold text-zinc-900 transition-colors active:bg-zinc-900 active:text-white md:hover:bg-zinc-900 md:hover:text-white"
    >
      {#if quantity > 0}
        En carrito ({quantity})
      {:else}
        Agregar al carrito
      {/if}
    </button>
  </div>
</div>
