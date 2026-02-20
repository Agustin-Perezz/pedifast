<script lang="ts">
  import type { ShopItemCategory } from '$lib/types/product';
  import CartBottomBar from './components/cart-bottom-bar.svelte';
  import CheckoutOverlay from './components/checkout-overlay.svelte';
  import ProductCard from './components/product-card.svelte';

  let { data } = $props();
  let checkoutOpen = $state(false);

  const CATEGORY_ORDER: ShopItemCategory[] = [
    'comidas',
    'bebidas',
    'postres',
    'acompañamientos'
  ];

  const CATEGORY_LABELS: Record<ShopItemCategory, string> = {
    comidas: 'Comidas',
    bebidas: 'Bebidas',
    postres: 'Postres',
    acompañamientos: 'Acompañamientos'
  };

  const groupedCategories = $derived(
    CATEGORY_ORDER.map((cat) => ({
      key: cat,
      label: CATEGORY_LABELS[cat],
      products: data.products.filter((p) => p.category === cat)
    })).filter((c) => c.products.length > 0)
  );
</script>

<div class="min-h-screen bg-[#F5F5F5] pt-6 pb-28">
  <h1 class="mb-6 px-4 text-2xl font-semibold text-zinc-950">Menú</h1>

  {#each groupedCategories as { key, label, products } (key)}
    <section class="mb-8">
      <h2 class="mb-3 px-4 text-base font-semibold text-zinc-700">{label}</h2>
      <div class="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2">
        {#each products as product (product.id)}
          <ProductCard {product} />
        {/each}
      </div>
    </section>
  {/each}
</div>

<CartBottomBar onConfirm={() => (checkoutOpen = true)} />
<CheckoutOverlay bind:open={checkoutOpen} />
