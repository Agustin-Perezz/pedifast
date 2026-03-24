<script lang="ts">
  import { page } from '$app/stores';
  import { FormField } from '$components/ui/form-field';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { zod4 } from 'sveltekit-superforms/adapters';

  import { cart } from '$lib/cart.svelte';
  import {
    DeliveryMethod,
    orderSchema,
    PaymentMethod,
    type DeliveryMethodValue,
    type PaymentMethodValue
  } from '$lib/schemas/order';
  import { type PendingWhatsappOrder } from '$lib/whatsapp';
  import DeliveryMethodSelector from './delivery-method-selector.svelte';
  import MapPicker from './map-picker.svelte';
  import PaymentButtons from './payment-buttons.svelte';

  const CURRENCY_ID = 'ARS';
  const MP_PREFERENCE_API = '/api/mp/preference';

  interface Props {
    onComplete: () => void;
    shop: {
      address: string | null;
      deliveryPrice: number | null;
      whatsappPhone: string;
    };
  }

  let { onComplete, shop }: Props = $props();

  let submitting = $state<PaymentMethodValue | null>(null);
  let error = $state('');
  let mapDeliveryCost = $state<number | null>(null);

  const { form, errors, enhance } = superForm(defaults(zod4(orderSchema)), {
    SPA: true,
    validators: zod4(orderSchema),
    onUpdate: async ({ form: f }) => {
      if (!f.valid) {
        return;
      }

      submitting = f.data.paymentMethod;
      error = '';

      const shopName = $page.params.shopName;

      const items = cart.items.map((item) => {
        const accNames = item.selectedAccessories.map((a) => {
          return a.optionName;
        });
        const title =
          accNames.length > 0
            ? `${item.product.name} (${accNames.join(', ')})`
            : item.product.name;
        return {
          title,
          quantity: item.quantity,
          unit_price: cart.getItemUnitPrice(item),
          currency_id: CURRENCY_ID
        };
      });

      const pendingOrder: PendingWhatsappOrder = {
        shopName,
        whatsappPhone: shop.whatsappPhone,
        nombre: f.data.nombre,
        deliveryMethod: f.data.deliveryMethod,
        address: f.data.address,
        notas: f.data.notas,
        paymentMethod: f.data.paymentMethod,
        items: cart.items.map((item) => {
          const accNames = item.selectedAccessories.map((a) => {
            return a.optionName;
          });
          return {
            name:
              accNames.length > 0
                ? `${item.product.name} (${accNames.join(', ')})`
                : item.product.name,
            quantity: item.quantity,
            unitPrice: cart.getItemUnitPrice(item),
            accessories: item.selectedAccessories.map((a) => ({
              name: a.optionName,
              priceDelta: a.priceDelta
            }))
          };
        }),
        total:
          cart.items.reduce((sum, item) => {
            return sum + cart.getItemUnitPrice(item) * item.quantity;
          }, 0) +
          (f.data.deliveryMethod === DeliveryMethod.enum.delivery
            ? (mapDeliveryCost ?? shop.deliveryPrice ?? 0)
            : 0)
      };

      try {
        if (f.data.paymentMethod === PaymentMethod.enum.efectivo) {
          const id = `${shopName}-${Date.now()}`;
          localStorage.setItem(`order-${id}`, JSON.stringify(pendingOrder));
          cart.clear();
          onComplete();
          window.location.href = `/pedido/${id}?status=${PaymentMethod.enum.efectivo}`;
          return;
        }

        const response = await fetch(MP_PREFERENCE_API, {
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

        const { init_point, externalReference } = await response.json();

        localStorage.setItem(
          `order-${externalReference}`,
          JSON.stringify(pendingOrder)
        );
        window.location.href = init_point;
      } catch (err) {
        error = err instanceof Error ? err.message : 'Error inesperado';
        submitting = null;
      }
    }
  });
</script>

<form method="POST" use:enhance class="flex flex-col gap-4">
  <DeliveryMethodSelector
    deliveryMethod={$form.deliveryMethod}
    onSelect={(method: DeliveryMethodValue) => ($form.deliveryMethod = method)}
    address={shop.address}
    deliveryPrice={shop.deliveryPrice}
  />

  <div
    class="grid transition-all duration-200 {$form.deliveryMethod ===
    DeliveryMethod.enum.delivery
      ? 'grid-rows-[1fr]'
      : 'grid-rows-[0fr]'}"
  >
    <div class="flex flex-col gap-3 overflow-hidden">
      <FormField
        label="Dirección"
        name="address"
        placeholder="Calle, número, piso, etc."
        bind:value={$form.address}
        error={$errors.address}
      />
      <MapPicker
        onResult={({ shippingCost }) => {
          mapDeliveryCost = shippingCost;
        }}
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

  <PaymentButtons
    {submitting}
    onSelectPayment={(method) => ($form.paymentMethod = method)}
  />
</form>
