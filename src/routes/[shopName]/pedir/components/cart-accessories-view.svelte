<script lang="ts">
  import { Button } from '$components/ui/button';

  import { cart } from '$lib/cart.svelte';
  import AccessoryGroupSection from './accessory-group-section.svelte';
  import { CartAccessoriesState } from './cart-accessories-state.svelte';
  import CartItemCard from './cart-item-card.svelte';

  interface Props {
    onContinue: () => void;
  }

  let { onContinue }: Props = $props();

  const state = new CartAccessoriesState();
</script>

<div class="flex flex-col gap-6">
  {#each cart.items as item, idx (item.product.id)}
    {#if idx > 0}
      <hr class="border-zinc-200" />
    {/if}

    <div class="flex flex-col gap-4">
      <CartItemCard
        name={item.product.name}
        price={item.product.price}
        imageUrl={item.product.images[0]}
        quantity={item.quantity}
      />

      {#each item.product.accessoryGroups ?? [] as group (group.id)}
        <AccessoryGroupSection
          {group}
          selectedOptionIds={state.getSelectedOptionIds(
            item.product.id,
            group.id
          )}
          onSelect={(optionIds) => {
            state.selectOptions(item.product.id, group.id, optionIds);
          }}
        />
      {/each}
    </div>
  {/each}

  <Button
    class="min-h-[44px] w-full rounded-lg"
    disabled={!state.canContinue()}
    onclick={() => {
      state.commitAndContinue(onContinue);
    }}
  >
    Continuar
  </Button>
</div>
