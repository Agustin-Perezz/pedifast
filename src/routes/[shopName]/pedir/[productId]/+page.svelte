<script lang="ts">
  import { ArrowLeft } from '@lucide/svelte';

  import { cart } from '$lib/cart.svelte';
  import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
  import * as Carousel from '$lib/components/ui/carousel/index.js';
  import { formatPrice } from '$lib/utils';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const { product, shopName } = data;

  let carouselApi: CarouselAPI | undefined = $state();
  let selectedIndex = $state(0);

  function handleSetApi(api: CarouselAPI | undefined) {
    if (!api) return;
    carouselApi = api;
    selectedIndex = api.selectedScrollSnap();
    api.on('select', () => {
      selectedIndex = api.selectedScrollSnap();
    });
  }

  let quantity = $derived(cart.getQuantity(product.id));
  let imageIndices = $derived(product.images.map((_: string, i: number) => i));

  function handleAdd() {
    cart.add(product);
    navigator.vibrate?.(10);
  }
</script>

<div class="flex min-h-screen flex-col bg-[#E0E0E0]">
  <!-- ── White image section ── -->

  <div class="relative flex flex-col overflow-hidden bg-white">
    <div class="px-5 pt-5 pb-2">
      <a href="/{shopName}/pedir" class="inline-flex">
        <ArrowLeft class="h-5 w-5 text-zinc-400" />
      </a>
    </div>

    <Carousel.Root setApi={handleSetApi} class="w-full">
      <Carousel.Content>
        {#each product.images as image, i (i)}
          <Carousel.Item>
            <div class="flex items-center justify-center px-10 py-6">
              <img
                src={image}
                alt="{product.name} {i + 1}"
                class="max-h-[280px] w-full object-contain"
              />
            </div>
          </Carousel.Item>
        {/each}
      </Carousel.Content>
    </Carousel.Root>

    {#if product.images.length > 1}
      <div
        class="absolute right-0 bottom-10 left-0 flex items-center justify-center gap-2.5"
      >
        {#each imageIndices as i (i)}
          <button
            aria-label="Imagen {i + 1}"
            onclick={() => carouselApi?.scrollTo(i)}
            class="rounded-full transition-all duration-200 {i === selectedIndex
              ? 'h-3 w-3 border border-zinc-400'
              : 'h-2 w-2 bg-zinc-300'}"
          ></button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- ── Info card ── -->
  <div
    class="z-10 -mt-2 flex-1 rounded-t-3xl bg-white px-6 pt-7 pb-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] shadow-slate-300 md:text-center"
  >
    <h1 class="text-2xl font-bold text-zinc-900">{product.name}</h1>
    <p class="mt-0.5 text-sm text-zinc-400 italic">{product.category}</p>

    {#if product.description}
      <p class="mt-6 text-sm leading-relaxed text-zinc-400">
        {product.description}
      </p>
    {/if}

    <div
      class="mt-10 flex items-center justify-between md:justify-center md:gap-10"
    >
      <span class="text-2xl font-bold text-zinc-900"
        >{formatPrice(product.price)}</span
      >
      <button
        onclick={handleAdd}
        class="rounded-full border-2 border-zinc-800 px-6 py-2.5 text-sm font-bold text-zinc-900 transition-colors active:bg-zinc-900 active:text-white"
      >
        {#if quantity > 0}
          En carrito ({quantity})
        {:else}
          Agregar al carrito
        {/if}
      </button>
    </div>
  </div>
</div>
