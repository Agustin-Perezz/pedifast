<script lang="ts">
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
    class="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white pb-[env(safe-area-inset-bottom)]"
  >
    <div class="flex items-center justify-between px-4 py-3">
      <div class="flex flex-col">
        <span class="text-xs text-zinc-500">{cart.totalItems} items</span>
        <span class="font-mono text-lg font-semibold text-zinc-950">
          {formatPrice(cart.totalPrice)}
        </span>
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
