<script lang="ts">
  import { goto } from '$app/navigation';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import { Button } from '$components/ui/button';
  import { FormField } from '$components/ui/form-field';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { zod4 } from 'sveltekit-superforms/adapters';

  import { cart } from '$lib/cart.svelte';
  import { orderSchema } from '$lib/schemas/order';
  import type { OrderSummary } from '$lib/types/product';

  interface Props {
    onComplete: () => void;
  }

  let { onComplete }: Props = $props();

  let submitting = $state(false);

  const { form, errors, enhance } = superForm(defaults(zod4(orderSchema)), {
    SPA: true,
    validators: zod4(orderSchema),
    onUpdate: async ({ form: f }) => {
      if (!f.valid) return;

      submitting = true;

      await new Promise((r) => setTimeout(r, 1500));

      const orderId = crypto.randomUUID().slice(0, 8);
      const order: OrderSummary = {
        id: orderId,
        items: [...cart.items],
        total: cart.totalPrice,
        nombre: f.data.nombre as string,
        notas: f.data.notas as string | undefined,
        createdAt: new Date().toISOString()
      };

      sessionStorage.setItem(`order-${orderId}`, JSON.stringify(order));
      cart.clear();
      onComplete();
      goto(`/pedido/${orderId}`);
    }
  });
</script>

<form method="POST" use:enhance class="flex flex-col gap-4">
  <FormField
    label="Nombre"
    name="nombre"
    placeholder="Tu nombre"
    bind:value={$form.nombre}
    error={$errors.nombre}
  />

  <FormField
    label="Notas (opcional)"
    name="notas"
    placeholder="Instrucciones especiales, alergias, etc."
    bind:value={$form.notas}
    error={$errors.notas}
  />

  <Button
    type="submit"
    class="min-h-[44px] w-full rounded-lg"
    disabled={submitting}
  >
    {#if submitting}
      <LoaderCircle class="size-4 animate-spin" />
      Procesando...
    {:else}
      Pagar con Mercado Pago
    {/if}
  </Button>
</form>
