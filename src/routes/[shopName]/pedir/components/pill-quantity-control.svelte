<script lang="ts">
  import { fade } from 'svelte/transition';

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          class="size-4"
        >
          <path
            d="M5 12h14"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <span class="min-w-[1.5rem] text-center text-sm font-semibold text-white"
        >{quantity}</span
      >
      <button
        onclick={onAdd}
        class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#16232B] active:scale-90"
        aria-label="Agregar uno"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          class="size-4"
        >
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  {:else}
    <button
      transition:fade={{ duration: 150 }}
      onclick={onAdd}
      class="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#16232B] text-white active:scale-95"
      aria-label="Agregar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        class="size-5"
      >
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>
    </button>
  {/if}
</div>
