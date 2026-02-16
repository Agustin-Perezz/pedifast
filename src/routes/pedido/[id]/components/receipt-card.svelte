<script lang="ts">
  import * as Card from '$components/ui/card';
  import { Separator } from '$components/ui/separator';

  import type { OrderSummary } from '$lib/types/product';
  import { formatPrice } from '$lib/utils';

  interface Props {
    order: OrderSummary;
  }

  let { order }: Props = $props();
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Detalle del pedido</Card.Title>
  </Card.Header>
  <Card.Content class="flex flex-col gap-3">
    {#each order.items as item (item.product.id)}
      <div class="flex items-center justify-between text-sm">
        <span class="text-zinc-950">
          {item.product.name}
          <span class="text-zinc-500">x{item.quantity}</span>
        </span>
        <span class="font-mono text-zinc-500">
          {formatPrice(item.product.price * item.quantity)}
        </span>
      </div>
    {/each}

    <Separator />

    <div class="flex items-center justify-between">
      <span class="font-medium text-zinc-950">Total</span>
      <span class="font-mono font-semibold text-zinc-950">
        {formatPrice(order.total)}
      </span>
    </div>
  </Card.Content>
</Card.Root>
