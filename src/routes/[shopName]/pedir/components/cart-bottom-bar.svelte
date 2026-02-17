<script lang="ts">
  import ClipboardList from '@lucide/svelte/icons/clipboard-list';
  import { Button } from '$components/ui/button';

  import { cart } from '$lib/cart.svelte';
  import { formatPrice } from '$lib/utils';

  interface Props {
    onConfirm: () => void;
  }

  let { onConfirm }: Props = $props();
</script>

{#if !cart.isEmpty}
  <div
    class="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
  >
    <div
      class="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-zinc-200"
    >
      <div class="flex items-center gap-3">
        <div
          class="flex size-10 items-center justify-center rounded-xl bg-zinc-900"
        >
          <ClipboardList class="size-5 text-white" />
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-zinc-500">
            {cart.totalItems}
            {cart.totalItems === 1 ? 'item' : 'items'}
          </span>
          <span class="font-mono text-lg font-semibold text-zinc-950">
            {formatPrice(cart.totalPrice)}
          </span>
        </div>
      </div>
      <Button
        class="min-h-[44px] min-w-[44px] rounded-lg px-6"
        onclick={onConfirm}
      >
        Confirmar Pedido
      </Button>
    </div>
  </div>
{/if}
