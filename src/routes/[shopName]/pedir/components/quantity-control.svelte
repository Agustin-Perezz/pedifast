<script lang="ts">
  import Minus from '@lucide/svelte/icons/minus';
  import Plus from '@lucide/svelte/icons/plus';
  import { Button } from '$components/ui/button';

  interface Props {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
  }

  let { quantity, onIncrement, onDecrement }: Props = $props();
</script>

<div class="flex items-center gap-1">
  <Button
    variant="outline"
    size="icon-sm"
    class="min-h-[44px] min-w-[44px] rounded-lg"
    onclick={onDecrement}
  >
    <Minus class="size-4" />
  </Button>
  <span class="min-w-[2rem] text-center font-mono text-sm font-medium"
    >{quantity}</span
  >
  <Button
    variant="outline"
    size="icon-sm"
    class="min-h-[44px] min-w-[44px] rounded-lg"
    onclick={onIncrement}
  >
    <Plus class="size-4" />
  </Button>
</div>
