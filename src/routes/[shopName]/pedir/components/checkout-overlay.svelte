<script lang="ts">
  import * as Dialog from '$components/ui/dialog';
  import * as Drawer from '$components/ui/drawer';

  import { cart } from '$lib/cart.svelte';
  import CartAccessoriesView from './cart-accessories-view.svelte';
  import CheckoutForm from './checkout-form.svelte';
  import OrderSummary from './order-summary.svelte';

  const CheckoutStep = {
    accessories: 'accessories',
    checkout: 'checkout'
  } as const;

  type CheckoutStep = (typeof CheckoutStep)[keyof typeof CheckoutStep];

  interface Props {
    open: boolean;
    shop: {
      address: string | null;
      deliveryPrice: number | null;
      whatsappPhone: string;
    };
  }

  let { open = $bindable(false), shop }: Props = $props();

  let step = $state<CheckoutStep>(CheckoutStep.checkout);
  let isDesktop = $state(false);

  $effect(() => {
    if (open) {
      step = cart.hasItemsWithAccessories
        ? CheckoutStep.accessories
        : CheckoutStep.checkout;
    }
  });

  $effect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    isDesktop = mql.matches;

    const handler = (e: MediaQueryListEvent) => {
      isDesktop = e.matches;
    };
    mql.addEventListener('change', handler);
    return () => {
      return mql.removeEventListener('change', handler);
    };
  });

  const title = $derived(
    step === CheckoutStep.accessories
      ? 'Personalizar pedido'
      : 'Finalizar Pedido'
  );
</script>

{#snippet content()}
  {#if step === CheckoutStep.accessories}
    <CartAccessoriesView
      onContinue={() => {
        step = CheckoutStep.checkout;
      }}
    />
  {:else}
    <div class="flex flex-col gap-6">
      <OrderSummary />
      <CheckoutForm onComplete={() => (open = false)} {shop} />
    </div>
  {/if}
{/snippet}

{#if isDesktop}
  <Dialog.Root bind:open>
    <Dialog.Content class="max-w-md">
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>
      {@render content()}
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <Drawer.Content class="overflow-hidden">
      <Drawer.Header>
        <Drawer.Title>{title}</Drawer.Title>
      </Drawer.Header>
      <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        {@render content()}
      </div>
    </Drawer.Content>
  </Drawer.Root>
{/if}
