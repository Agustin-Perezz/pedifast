<script lang="ts">
  import type { ShopItemCategory as ShopItemCategoryType } from '$lib/types/product';
  import type { GroupedCategory } from '../page.state.svelte';

  interface Props {
    groupedCategories: GroupedCategory[];
    activeCategory: ShopItemCategoryType | null;
    onCategoryClick: (key: ShopItemCategoryType) => void;
  }

  const { groupedCategories, activeCategory, onCategoryClick }: Props =
    $props();
</script>

<div
  class="scrollbar-hide sticky top-0 z-10 flex gap-2 overflow-x-auto bg-[#F5F5F5] px-4 py-3 md:flex-wrap md:justify-center"
>
  {#each groupedCategories as { key, label, emoji } (key)}
    <button
      class="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors {activeCategory ===
      key
        ? 'bg-zinc-900 text-white'
        : ' text-zinc-600 hover:text-zinc-900'}"
      onclick={() => onCategoryClick(key)}
    >
      {emoji}
      {label}
    </button>
  {/each}
</div>
