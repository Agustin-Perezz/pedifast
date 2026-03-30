<script lang="ts">
  import { page } from '$app/stores';
  import { FormField } from '$components/ui/form-field';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { zod4 } from 'sveltekit-superforms/adapters';

  import { cart } from '$lib/cart.svelte';
  import {
    DeliveryMethod,
    OrderFlow,
    orderSchema,
    PaymentMethod,
    type DeliveryMethodValue,
    type OrderFlowValue,
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
      lat: number;
      lng: number;
      pricePerKm: number;
      orderFlow: OrderFlowValue;
    };
  }

  let { onComplete, shop }: Props = $props();

  let submitting = $state<PaymentMethodValue | null>(null);
  let error = $state('');
  let mapDeliveryCost = $state<number | null>(null);
  let mapDistanceKm = $state<number | null>(null);

  let calle = $state('');
  let numero = $state('');
  let showMap = $state(false);

  function confirmAddress() {
    const combined = `${calle.trim()} ${numero.trim()}`.trim();
    $form.address = combined;
    showMap = true;
  }

  function resetMap() {
    showMap = false;
    mapDeliveryCost = null;
    mapDistanceKm = null;
  }

  async function createDashboardOrder(
    shopName: string,
    externalReference: string,
    formData: {
      nombre: string;
      telefono?: string;
      notas?: string;
      deliveryMethod: string;
      address?: string;
      paymentMethod: string;
    },
    pendingOrder: PendingWhatsappOrder
  ) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopName,
        externalReference,
        customerName: formData.nombre,
        customerPhone: formData.telefono ?? '',
        notes: formData.notas,
        deliveryMethod: formData.deliveryMethod,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        paymentStatus:
          formData.paymentMethod === PaymentMethod.enum.efectivo
            ? 'approved'
            : 'pending',
        items: pendingOrder.items,
        total: pendingOrder.total,
        deliveryCost:
          formData.deliveryMethod === DeliveryMethod.enum.delivery
            ? (mapDeliveryCost ?? shop.deliveryPrice ?? 0)
            : 0
      })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? 'Error al crear el pedido');
    }
  }

  const schema = orderSchema(shop.orderFlow);
  const { form, errors, enhance } = superForm(defaults(zod4(schema)), {
    SPA: true,
    validators: zod4(schema),
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

      const isDashboard = shop.orderFlow === OrderFlow.enum.dashboard;

      try {
        if (f.data.paymentMethod === PaymentMethod.enum.efectivo) {
          const id = `${shopName}-${Date.now()}`;

          if (isDashboard) {
            await createDashboardOrder(shopName, id, f.data, pendingOrder);
          } else {
            localStorage.setItem(`order-${id}`, JSON.stringify(pendingOrder));
          }

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

        if (isDashboard) {
          await createDashboardOrder(
            shopName,
            externalReference,
            f.data,
            pendingOrder
          );
        } else {
          localStorage.setItem(
            `order-${externalReference}`,
            JSON.stringify(pendingOrder)
          );
        }

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
    {mapDeliveryCost}
    {mapDistanceKm}
  />

  <div
    class="grid transition-all duration-200 {$form.deliveryMethod ===
    DeliveryMethod.enum.delivery
      ? 'grid-rows-[1fr]'
      : 'grid-rows-[0fr]'}"
  >
    <div class="flex flex-col gap-3 overflow-hidden">
      <div class="flex gap-2">
        <div class="flex-1">
          <FormField
            label="Calle"
            name="calle"
            placeholder="Ej: Alem"
            bind:value={calle}
            oninput={resetMap}
          />
        </div>
        <div class="w-28">
          <FormField
            label="Número"
            name="numero"
            placeholder="Ej: 1510"
            bind:value={numero}
            oninput={resetMap}
          />
        </div>
      </div>
      {#if $errors.address}
        <p class="text-destructive text-xs">{$errors.address}</p>
      {/if}
      {#if !showMap}
        <button
          type="button"
          class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!calle.trim() || !numero.trim()}
          onclick={confirmAddress}
        >
          Confirmar en el mapa
        </button>
      {:else}
        <MapPicker
          originLat={shop.lat}
          originLng={shop.lng}
          pricePerKm={shop.pricePerKm}
          address={$form.address}
          onResult={({ shippingCost, distanceKm }) => {
            mapDeliveryCost = shippingCost;
            mapDistanceKm = distanceKm;
            showMap = false;
          }}
        />
      {/if}
    </div>
  </div>

  <FormField
    label="Nombre"
    name="nombre"
    placeholder="Tu nombre"
    bind:value={$form.nombre}
    error={$errors.nombre}
  />

  {#if shop.orderFlow === OrderFlow.enum.dashboard}
    <FormField
      label="Teléfono"
      name="telefono"
      placeholder="Ej: 3496 123456"
      bind:value={$form.telefono}
      error={$errors.telefono}
    />
  {/if}

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
