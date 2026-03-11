<script lang="ts">
  import CartBottomBar from './components/cart-bottom-bar.svelte';
  import CategoryNav from './components/category-nav.svelte';
  import CheckoutOverlay from './components/checkout-overlay.svelte';
  import ProductCard from './components/product-card.svelte';
  import ShopHeader from './components/shop-header.svelte';
  import { createPedirState } from './page.state.svelte';

  const { data } = $props();
  const pedir = createPedirState(data);
</script>

<div class="min-h-screen bg-[#F5F5F5]" use:pedir.observeSections>
  <ShopHeader />

  <div class="mx-auto max-w-lg pb-28 md:max-w-3xl lg:max-w-5xl">
    <CategoryNav
      groupedCategories={pedir.groupedCategories}
      activeCategory={pedir.activeCategory}
      onCategoryClick={(key) => pedir.scrollToCategory(key)}
    />

    {#each pedir.groupedCategories as { key, label, products }, catIndex (key)}
      <section id={key} class="mb-8 pt-2">
        <h2 class="mb-3 px-4 text-lg font-semibold text-zinc-700">{label}</h2>
        <div
          class="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2 md:grid md:grid-cols-3 md:overflow-x-visible lg:grid-cols-4"
        >
          {#each products as product, productIndex (product.id)}
            <ProductCard
              {product}
              shopName={data.shopName}
              priority={catIndex === 0 && productIndex === 0}
            />
          {/each}
        </div>
      </section>
    {/each}
  </div>
</div>

<CartBottomBar onConfirm={() => (pedir.checkoutOpen = true)} />
<CheckoutOverlay bind:open={pedir.checkoutOpen} shop={data.shop} />
