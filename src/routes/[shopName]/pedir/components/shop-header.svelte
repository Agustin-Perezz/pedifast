<script lang="ts">
  import ShopBanner from './shop-banner.svelte';
  import ShopInfo from './shop-info.svelte';

  interface ShopHeaderProps {
    shop: {
      address: string | null;
      displayName: string | null;
      logoUrl: string | null;
      portraitUrl: string | null;
      openHours: string | null;
    };
    shopName: string;
  }

  const { shop, shopName }: ShopHeaderProps = $props();

  const name = $derived(shop.displayName ?? shopName);
</script>

<header class="relative">
  <ShopBanner {name} portraitUrl={shop.portraitUrl} logoUrl={shop.logoUrl} />
  <ShopInfo {name} address={shop.address} openHours={shop.openHours} />
</header>
