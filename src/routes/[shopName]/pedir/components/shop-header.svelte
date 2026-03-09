<script lang="ts">
  import Bell from '@lucide/svelte/icons/bell';
  import MapPin from '@lucide/svelte/icons/map-pin';

  interface ShopHeaderData {
    name: string;
    logoUrl: string | null;
    openHours: string;
    location: string;
    isOpen: boolean;
  }

  const MOCK_SHOP = {
    name: 'La Esquina Burger',
    logoUrl: null,
    openHours: 'Lun–Sáb  12:00 – 23:00',
    location: 'Av. Corrientes 1234, CABA',
    isOpen: true
  } satisfies ShopHeaderData;
</script>

<div class="bg-gradient-to-b from-[#DDFF44] to-[#F5F5F5] px-5 pt-8 pb-7">
  <div class="mb-6 flex items-center justify-between">
    <div
      class="flex items-center gap-3 rounded-full border border-black/10 bg-white/60 py-2 pr-5 pl-2 shadow-sm backdrop-blur-sm"
    >
      <div
        class="size-12 shrink-0 overflow-hidden rounded-full border border-black/10 bg-white"
      >
        {#if MOCK_SHOP.logoUrl}
          <img
            src={MOCK_SHOP.logoUrl}
            alt="{MOCK_SHOP.name} logo"
            class="h-full w-full object-cover"
          />
        {:else}
          <div
            class="flex h-full w-full items-center justify-center text-xl font-black text-zinc-400"
          >
            {MOCK_SHOP.name[0]}
          </div>
        {/if}
      </div>
      <div class="flex flex-col">
        <span class="text-sm font-bold text-zinc-900">{MOCK_SHOP.name}</span>
        <span class="text-xs text-zinc-500">Hamburguesas · Papas · Bebidas</span
        >
      </div>
    </div>

    <button
      class="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
      aria-label="Notificaciones"
    >
      <Bell class="size-5 text-zinc-700" />
    </button>
  </div>

  <h1 class="mb-5 text-[1.9rem] leading-none font-black tracking-tight">
    <span class="text-zinc-900">Pedí </span><span class="px-1 text-zinc-300"
      >&</span
    ><span class="text-zinc-900"> Comé. 🍔</span>
  </h1>

  <div
    class="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[#DDFF44] px-3 py-1.5 shadow-sm"
  >
    <MapPin class="size-3.5 shrink-0 text-zinc-700" />
    <span class="text-xs font-medium text-zinc-800">{MOCK_SHOP.location}</span>
    <span class="mx-1 text-zinc-400">·</span>
    <span class="text-xs text-zinc-600">{MOCK_SHOP.openHours}</span>
    <span
      class="ml-1 size-1.5 shrink-0 rounded-full {MOCK_SHOP.isOpen
        ? 'bg-emerald-500'
        : 'bg-zinc-400'}"
    ></span>
  </div>
</div>
