<script lang="ts">
  import {
    AccessorySelectionMode,
    type AccessoryGroup,
    type AccessoryOption
  } from '$lib/types/product';
  import { formatPrice } from '$lib/utils';

  interface Props {
    group: AccessoryGroup;
    selectedOptionIds: number[];
    onSelect: (optionIds: number[]) => void;
  }

  let { group, selectedOptionIds, onSelect }: Props = $props();

  function handleOptionClick(option: AccessoryOption) {
    if (group.selectionMode === AccessorySelectionMode.single) {
      onSelect([option.id]);
    } else {
      const isSelected = selectedOptionIds.includes(option.id);
      if (isSelected) {
        onSelect(
          selectedOptionIds.filter((id) => {
            return id !== option.id;
          })
        );
      } else {
        onSelect([...selectedOptionIds, option.id]);
      }
    }
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center gap-2">
    <span class="text-sm font-medium">{group.name}</span>
    {#if group.isRequired}
      <span
        class="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-zinc-500 uppercase"
      >
        Requerido
      </span>
    {/if}
  </div>

  <div class="flex flex-col gap-1.5">
    {#each group.options as option (option.id)}
      {@const isSelected = selectedOptionIds.includes(option.id)}
      <button
        type="button"
        onclick={() => {
          handleOptionClick(option);
        }}
        class="flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors
          {isSelected
          ? 'border-zinc-900'
          : 'border-zinc-200 hover:border-zinc-300'}"
      >
        <span class="text-base leading-none">
          {#if group.selectionMode === AccessorySelectionMode.single}
            {isSelected ? '●' : '○'}
          {:else}
            {isSelected ? '☑' : '☐'}
          {/if}
        </span>
        <span class="flex-1 text-sm font-medium">{option.name}</span>
        {#if option.priceDelta !== 0}
          <span class="text-sm text-zinc-500">
            +{formatPrice(option.priceDelta)}
          </span>
        {/if}
      </button>
    {/each}
  </div>
</div>
