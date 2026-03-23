<script lang="ts">
  import { ArrowLeft } from '@lucide/svelte';

  import { cart } from '$lib/cart.svelte';
  import type { PageData } from './$types';
  import ProductImageCarousel from './components/product-image-carousel.svelte';
  import ProductInfoCard from './components/product-info-card.svelte';

  let { data }: { data: PageData } = $props();

  const { product, shopName } = data;

  let quantity = $derived(cart.getQuantity(product.id));

  function handleAdd() {
    cart.add(product);
    navigator.vibrate?.(10);
  }
</script>

<div class="flex min-h-screen flex-col bg-[#E0E0E0] md:bg-white">
  <div class="px-5 pt-5 pb-2 md:mx-auto md:w-full md:max-w-5xl">
    <a href="/{shopName}/pedir" class="inline-flex">
      <ArrowLeft class="h-5 w-5 text-zinc-400" />
    </a>
  </div>

  <div
    class="flex flex-col md:mx-auto md:w-full md:max-w-5xl md:flex-row md:gap-12 md:px-8 md:py-8"
  >
    <ProductImageCarousel images={product.images} productName={product.name} />

    <ProductInfoCard
      name={product.name}
      category={product.category}
      description={product.description}
      price={product.price}
      {quantity}
      onAdd={handleAdd}
    />
  </div>
</div>
