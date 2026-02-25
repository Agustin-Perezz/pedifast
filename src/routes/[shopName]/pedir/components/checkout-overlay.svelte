<script lang="ts">
  import * as Dialog from '$components/ui/dialog';
  import * as Drawer from '$components/ui/drawer';

  import CheckoutForm from './checkout-form.svelte';
  import OrderSummary from './order-summary.svelte';

  interface Props {
    open: boolean;
    shop: {
      address: string | null;
      deliveryPrice: number | null;
      whatsappPhone: string;
    };
  }

  let { open = $bindable(false), shop }: Props = $props();

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
  <div class="flex flex-col gap-6">
    <OrderSummary />
    <CheckoutForm onComplete={() => (open = false)} {shop} />
  </div>
{/snippet}

{#if isDesktop}
  <Dialog.Root bind:open>
    <Dialog.Content class="max-w-md">
      <Dialog.Header>
        <Dialog.Title>Finalizar Pedido</Dialog.Title>
      </Dialog.Header>
      {@render content()}
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Finalizar Pedido</Drawer.Title>
      </Drawer.Header>
      <div class="px-4 pb-6">
        {@render content()}
      </div>
    </Drawer.Content>
  </Drawer.Root>
{/if}
