<script lang="ts">
  import { page } from '$app/stores';
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import MapPin from '@lucide/svelte/icons/map-pin';
  import { Button } from '$components/ui/button';
  import { FormField } from '$components/ui/form-field';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { zod4 } from 'sveltekit-superforms/adapters';

  import { cart } from '$lib/cart.svelte';
  import { DeliveryMethod, orderSchema } from '$lib/schemas/order';

  interface Props {
    onComplete: () => void;
    shop: { address: string | null; deliveryPrice: number | null };
  }

  let { onComplete, shop }: Props = $props();

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
            deliveryMethod: f.data.deliveryMethod,
            address: f.data.address,
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
  <div class="flex flex-col gap-2">
    <span class="text-sm font-medium">Método de entrega</span>

    <button
      type="button"
      onclick={() => ($form.deliveryMethod = DeliveryMethod.enum.pickup)}
      class="flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors
        {$form.deliveryMethod === DeliveryMethod.enum.pickup
        ? 'border-zinc-900'
        : 'border-zinc-200 hover:border-zinc-300'}"
    >
      <span class="mt-0.5 text-base leading-none">
        {$form.deliveryMethod === DeliveryMethod.enum.pickup ? '●' : '○'}
      </span>
      <div class="flex flex-col gap-0.5">
        <span class="font-medium">Retiro en local</span>
        {#if shop.address}
          <span class="flex items-center gap-1 text-xs text-zinc-500">
            <MapPin class="size-3 shrink-0" />
            {shop.address}
          </span>
        {/if}
      </div>
    </button>

    <button
      type="button"
      onclick={() => ($form.deliveryMethod = DeliveryMethod.enum.delivery)}
      class="flex w-full items-start gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors
        {$form.deliveryMethod === DeliveryMethod.enum.delivery
        ? 'border-zinc-900'
        : 'border-zinc-200 hover:border-zinc-300'}"
    >
      <span class="mt-0.5 text-base leading-none">
        {$form.deliveryMethod === DeliveryMethod.enum.delivery ? '●' : '○'}
      </span>
      <div class="flex flex-col gap-0.5">
        <span class="font-medium">Envío a domicilio</span>
        <span class="text-xs text-zinc-500">
          {#if shop.deliveryPrice != null}
            Costo: ${shop.deliveryPrice.toLocaleString('es-AR')}
          {:else}
            Costo a consultar
          {/if}
        </span>
      </div>
    </button>
  </div>

  <div
    class="grid transition-all duration-200 {$form.deliveryMethod ===
    DeliveryMethod.enum.delivery
      ? 'grid-rows-[1fr]'
      : 'grid-rows-[0fr]'}"
  >
    <div class="overflow-hidden">
      <FormField
        label="Dirección"
        name="address"
        placeholder="Calle, número, piso, etc."
        bind:value={$form.address}
        error={$errors.address}
      />
    </div>
  </div>

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
