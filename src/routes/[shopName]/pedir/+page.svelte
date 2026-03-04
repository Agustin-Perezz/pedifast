<script lang="ts">
  import {
    CATEGORY_LABELS,
    ShopItemCategory,
    type ShopItemCategory as ShopItemCategoryType
  } from '$lib/types/product';
  import CartBottomBar from './components/cart-bottom-bar.svelte';
  import CheckoutOverlay from './components/checkout-overlay.svelte';
  import ProductCard from './components/product-card.svelte';

  let { data } = $props();
  let checkoutOpen = $state(false);
  let activeCategory = $state<ShopItemCategoryType | null>(null);

  const CATEGORY_ORDER: ShopItemCategoryType[] = [
    ShopItemCategory.hamburguesas,
    ShopItemCategory.pizzas,
    ShopItemCategory.empanadas,
    ShopItemCategory.papas,
    ShopItemCategory.milanesas,
    ShopItemCategory.bebidas,
    ShopItemCategory.sandwiches,
    ShopItemCategory.ensaladas
  ];

  const groupedCategories = $derived(
    CATEGORY_ORDER.map((cat) => ({
      key: cat,
      label: CATEGORY_LABELS[cat],
      products: data.products.filter((p) => p.category === cat)
    })).filter((c) => c.products.length > 0)
  );

  function scrollToCategory(key: ShopItemCategoryType) {
    document
      .getElementById(key)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function observeSections(node: HTMLElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeCategory = entry.target.id as ShopItemCategoryType;
            break;
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    const sections = node.querySelectorAll('section[id]');
    sections.forEach((s) => observer.observe(s));

    return { destroy: () => observer.disconnect() };
  }
</script>

<div
  class="mx-auto min-h-screen max-w-lg bg-[#F5F5F5] pt-6 pb-28"
  use:observeSections
>
  <h1 class="mb-4 px-4 text-2xl font-semibold text-zinc-950">Menú</h1>

  <div
    class="scrollbar-hide sticky top-0 z-10 flex gap-2 overflow-x-auto bg-[#F5F5F5] px-4 py-3"
  >
    {#each groupedCategories as { key, label } (key)}
      <button
        class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors {activeCategory ===
        key
          ? 'border-zinc-900 bg-zinc-900 text-white'
          : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900'}"
        onclick={() => scrollToCategory(key)}
      >
        {label}
      </button>
    {/each}
  </div>

  {#each groupedCategories as { key, label, products } (key)}
    <section id={key} class="mb-8 pt-2">
      <h2 class="mb-3 px-4 text-lg font-semibold text-zinc-700">{label}</h2>
      <div class="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2">
        {#each products as product (product.id)}
          <ProductCard {product} shopName={data.shopName} />
        {/each}
      </div>
    </section>
  {/each}
</div>

<CartBottomBar onConfirm={() => (checkoutOpen = true)} />
<CheckoutOverlay bind:open={checkoutOpen} shop={data.shop} />
