<script lang="ts">
  import * as Dialog from '$components/ui/dialog';
  import * as Drawer from '$components/ui/drawer';
  import { Separator } from '$components/ui/separator';

  import { cart } from '$lib/cart.svelte';
  import { formatPrice } from '$lib/utils';
  import CheckoutForm from './checkout-form.svelte';

  let { open = $bindable(false) }: { open: boolean } = $props();

  let isDesktop = $state(false);

  $effect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    isDesktop = mql.matches;

    const handler = (e: MediaQueryListEvent) => {
      isDesktop = e.matches;
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  });
</script>

{#snippet content()}
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between text-sm">
      <span class="text-zinc-500">{cart.totalItems} items</span>
      <span class="font-mono font-semibold text-zinc-950">
        {formatPrice(cart.totalPrice)}
      </span>
    </div>
    <Separator />
    <CheckoutForm onComplete={() => (open = false)} />
  </div>
{/snippet}

{#if isDesktop}
  <Dialog.Root bind:open>
    <Dialog.Content class="max-w-md">
      <Dialog.Header>
        <Dialog.Title>Confirmar pedido</Dialog.Title>
        <Dialog.Description
          >Completá tus datos para finalizar.</Dialog.Description
        >
      </Dialog.Header>
      {@render content()}
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Confirmar pedido</Drawer.Title>
        <Drawer.Description
          >Completá tus datos para finalizar.</Drawer.Description
        >
      </Drawer.Header>
      <div class="px-4 pb-6">
        {@render content()}
      </div>
    </Drawer.Content>
  </Drawer.Root>
{/if}
