<script lang="ts">
  import { fade } from 'svelte/transition';
  import Minus from '@lucide/svelte/icons/minus';
  import Plus from '@lucide/svelte/icons/plus';

  interface Props {
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
  }

  let { quantity, onAdd, onRemove }: Props = $props();
</script>

<div class="relative flex h-9 items-center justify-end">
  {#if quantity > 0}
    <div
      transition:fade={{ duration: 150 }}
      class="absolute right-0 flex items-center justify-between rounded-full bg-[#16232B] px-1 py-1"
    >
      <button
        onclick={onRemove}
        class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#16232B] active:scale-90"
        aria-label="Quitar uno"
      >
        <Minus class="size-4" strokeWidth={2.5} />
      </button>
      <span class="min-w-[1.5rem] text-center text-sm font-semibold text-white"
        >{quantity}</span
      >
      <button
        onclick={onAdd}
        class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#16232B] active:scale-90"
        aria-label="Agregar uno"
      >
        <Plus class="size-4" strokeWidth={2.5} />
      </button>
    </div>
  {:else}
    <button
      transition:fade={{ duration: 150 }}
      onclick={onAdd}
      class="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#16232B] text-white active:scale-95"
      aria-label="Agregar"
    >
      <Plus class="size-5" strokeWidth={2.5} />
    </button>
  {/if}
</div>
