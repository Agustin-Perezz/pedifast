<script lang="ts">
  import { fade } from 'svelte/transition';
  import ArrowLeft from '@lucide/svelte/icons/arrow-left';

  import ReceiptCard from './components/receipt-card.svelte';
  import { createOrderPageState } from './page.state.svelte';

  // All state and logic lives in the module; this component is presentation-only
  const state = createOrderPageState();
</script>

<div class="flex min-h-screen flex-col">
  <header class="border-b border-zinc-200 bg-white">
    <div class="flex items-center gap-3 px-4 py-4">
      <a
        href={state.backUrl}
        class="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
        aria-label="Volver al menú"
      >
        <ArrowLeft class="h-4 w-4" />
      </a>
      <h1 class="text-base font-semibold text-zinc-950">
        {state.statusConfig.title}
      </h1>
    </div>
  </header>

  {#if state.order}
    <main class="flex flex-1 flex-col gap-6 px-4 py-6">
      <div class="flex flex-col items-center gap-3 py-4">
        <div
          transition:fade
          class="flex h-14 w-14 items-center justify-center rounded-full {state
            .statusConfig.iconBg}"
        >
          <state.statusConfig.icon
            class="h-6 w-6 {state.statusConfig.iconColor} {state.statusConfig
              .spinning
              ? 'animate-spin'
              : ''}"
          />
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-sm font-semibold text-zinc-950"
            >{state.statusConfig.title}</span
          >
          <span
            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {state
              .statusConfig.badgeClass}"
          >
            {state.statusConfig.badge}
          </span>
        </div>
      </div>

      <p class="text-center text-sm text-zinc-500">
        Gracias, {state.order.nombre}.
      </p>

      <ReceiptCard
        id={state.id}
        nombre={state.order.nombre}
        date={state.orderDate}
        notas={state.order.notas}
        items={state.order.items}
        total={state.order.total}
      />

      {#if state.paymentId}
        <p class="text-center text-xs text-zinc-400">
          ID de pago: {state.paymentId}
        </p>
      {/if}

      {#if state.whatsappUrl && state.isConfirmed}
        <a
          href={state.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="flex h-11 items-center justify-center rounded-lg bg-[#25D366] text-sm font-medium text-white transition-colors hover:bg-[#25D366]/90"
        >
          Enviar pedido por WhatsApp
        </a>
      {/if}

      <a
        href={state.backUrl}
        class="flex h-11 items-center justify-center rounded-lg border border-zinc-200 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 active:bg-zinc-100"
      >
        Realizar otro pedido
      </a>
    </main>
  {:else}
    <main class="flex flex-1 items-center justify-center px-4">
      <div class="flex flex-col items-center gap-3">
        <span class="text-sm text-zinc-500">Pedido no encontrado</span>
        <a
          href={state.backUrl}
          class="text-sm font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-700"
        >
          Volver al menu
        </a>
      </div>
    </main>
  {/if}
</div>
