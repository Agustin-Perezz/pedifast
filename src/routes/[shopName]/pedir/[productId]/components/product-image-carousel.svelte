<script lang="ts">
  import type { CarouselAPI } from '$lib/components/ui/carousel/context.js';
  import * as Carousel from '$lib/components/ui/carousel/index.js';

  interface Props {
    images: string[];
    productName: string;
  }

  let { images, productName }: Props = $props();

  let carouselApi: CarouselAPI | undefined = $state();
  let selectedIndex = $state(0);

  function handleSetApi(api: CarouselAPI | undefined) {
    if (!api) {
      return;
    }
    carouselApi = api;
    selectedIndex = api.selectedScrollSnap();
    api.on('select', () => {
      selectedIndex = api.selectedScrollSnap();
    });
  }

  let imageIndices = $derived(images.map((_, i) => i));
</script>

<div
  class="relative flex flex-col overflow-hidden bg-white md:w-1/2 md:rounded-2xl"
>
  <Carousel.Root setApi={handleSetApi} class="w-full">
    <Carousel.Content>
      {#each images as image, i (i)}
        <Carousel.Item>
          <div class="flex items-center justify-center px-10 py-6">
            <img
              src={image}
              alt="{productName} {i + 1}"
              class="max-h-[280px] w-full object-contain md:max-h-[400px]"
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding={i === 0 ? 'sync' : 'async'}
              fetchpriority={i === 0 ? 'high' : 'auto'}
            />
          </div>
        </Carousel.Item>
      {/each}
    </Carousel.Content>
  </Carousel.Root>

  {#if images.length > 1}
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
