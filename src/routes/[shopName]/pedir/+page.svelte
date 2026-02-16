<script lang="ts">
  import CartBottomBar from './components/cart-bottom-bar.svelte';
  import CheckoutOverlay from './components/checkout-overlay.svelte';
  import ProductCard from './components/product-card.svelte';
  import { products } from './data/products';

  let checkoutOpen = $state(false);
</script>

<div class="mx-auto max-w-4xl px-4 pt-6 pb-28">
  <h1 class="mb-6 text-2xl font-semibold text-zinc-950">Menú</h1>

  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {#each products as product (product.id)}
      <ProductCard {product} />
    {/each}
  </div>
</div>

<CartBottomBar onConfirm={() => (checkoutOpen = true)} />

<CheckoutOverlay bind:open={checkoutOpen} />
