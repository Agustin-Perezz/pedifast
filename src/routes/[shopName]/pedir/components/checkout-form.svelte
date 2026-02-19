<script lang="ts">
  import { page } from '$app/stores';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import { Button } from '$components/ui/button';
  import { FormField } from '$components/ui/form-field';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { zod4 } from 'sveltekit-superforms/adapters';

  import { cart } from '$lib/cart.svelte';
  import { orderSchema } from '$lib/schemas/order';

  interface Props {
    onComplete: () => void;
  }

  let { onComplete }: Props = $props();

  let submitting = $state(false);
  let error = $state('');

  const { form, errors, enhance } = superForm(defaults(zod4(orderSchema)), {
    SPA: true,
    validators: zod4(orderSchema),
    onUpdate: async ({ form: f }) => {
      if (!f.valid) return;

      submitting = true;
      error = '';

      const shopName = $page.params.shopName;

      const items = cart.items.map((item) => ({
        title: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        currency_id: 'ARS'
      }));

      try {
        const response = await fetch('/api/mp/preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shopName,
            nombre: f.data.nombre,
            notas: f.data.notas,
            items
          })
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.error ?? 'Error al crear la preferencia de pago'
          );
        }

        const { init_point } = await response.json();

        cart.clear();
        onComplete();
        window.location.href = init_point;
      } catch (err) {
        error = err instanceof Error ? err.message : 'Error inesperado';
        submitting = false;
      }
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

  {#if error}
    <p class="text-destructive text-sm">{error}</p>
  {/if}

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
