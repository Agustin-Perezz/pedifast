<script lang="ts">
  import LoaderCircle from '@lucide/svelte/icons/loader-circle';
  import { Button } from '$components/ui/button';

  import { PaymentMethod, type PaymentMethodValue } from '$lib/schemas/order';
  import MercadoPagoLogo from './mercado-pago-logo.svelte';

  interface Props {
    submitting: PaymentMethodValue | null;
    onSelectPayment: (method: PaymentMethodValue) => void;
  }

  let { submitting, onSelectPayment }: Props = $props();
</script>

<div class="flex flex-col gap-2">
  <Button
    type="submit"
    variant="outline"
    class="min-h-[44px] w-full rounded-lg"
    disabled={submitting !== null}
    onclick={() => onSelectPayment(PaymentMethod.enum.efectivo)}
  >
    {#if submitting === PaymentMethod.enum.efectivo}
      <LoaderCircle class="size-4 animate-spin" />
      Procesando...
    {:else}
      Pagar en efectivo
    {/if}
  </Button>

  <Button
    type="submit"
    class="min-h-[44px] w-full rounded-lg bg-[#FFE600] text-[#0A0080] shadow-none hover:bg-[#FFE600]/90"
    disabled={submitting !== null}
    onclick={() => onSelectPayment(PaymentMethod.enum.mercadopago)}
  >
    {#if submitting === PaymentMethod.enum.mercadopago}
      <LoaderCircle class="size-4 animate-spin" />
      Procesando...
    {:else}
      Pagar con mercado pago <MercadoPagoLogo />
    {/if}
  </Button>
</div>
