<script lang="ts">
  import Clock from '@lucide/svelte/icons/clock';

  interface ShopHeaderData {
    name: string;
    logoUrl: string | null;
    portraitUrl: string | null;
    openHours: string;
    location: string;
    isOpen: boolean;
  }

  const MOCK_SHOP = {
    name: 'La Esquina Burger',
    logoUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
    portraitUrl:
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop',
    openHours: 'Lun–Sáb  12:00 – 23:00',
    location: 'Av. Corrientes 1234, CABA',
    isOpen: true
  } satisfies ShopHeaderData;
</script>

<header class="relative">
  <div class="relative h-44 w-full overflow-hidden bg-zinc-300 sm:h-52">
    {#if MOCK_SHOP.portraitUrl}
      <img
        src={MOCK_SHOP.portraitUrl}
        alt="{MOCK_SHOP.name} portrait"
        class="h-full w-full object-cover"
      />
    {/if}
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
    ></div>
  </div>

  <div class="relative mx-auto max-w-lg px-5 md:max-w-3xl lg:max-w-5xl">
    <div
      class="absolute -top-10 left-5 size-20 overflow-hidden rounded-full border-4 border-white bg-white shadow-md"
    >
      {#if MOCK_SHOP.logoUrl}
        <img
          src={MOCK_SHOP.logoUrl}
          alt="{MOCK_SHOP.name} logo"
          class="h-full w-full object-cover"
        />
      {:else}
        <div
          class="flex h-full w-full items-center justify-center text-2xl font-black text-zinc-400"
        >
          {MOCK_SHOP.name[0]}
        </div>
      {/if}
    </div>
  </div>

  <div class="mx-auto max-w-lg px-5 pt-14 pb-4 md:max-w-3xl lg:max-w-5xl">
    <h1 class="text-xl font-bold text-zinc-900">{MOCK_SHOP.name}</h1>

    <div class="mt-3 flex flex-col gap-2.5">
      <a
        href="https://www.google.com/maps/search/?api=1&query={encodeURIComponent(
          MOCK_SHOP.location
        )}"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-center gap-2.5"
      >
        <svg
          class="size-5 shrink-0"
          viewBox="0 0 92.3 132.3"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#1a73e8"
            d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z"
          />
          <path
            fill="#ea4335"
            d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-32.4L10.8 16.5z"
          />
          <path
            fill="#4285f4"
            d="M46.2 28.5c9.8 0 17.7 7.9 17.7 17.7 0 4.3-1.6 8.3-4.2 11.4 0 0 13.9-16.1 27.5-32.1-5.6-10.8-15.3-19-27-22.7L32.6 34.8c3.3-3.8 8.1-6.3 13.6-6.3"
          />
          <path
            fill="#fbbc04"
            d="M46.2 63.8c-9.8 0-17.7-7.9-17.7-17.7 0-4.3 1.5-8.3 4.1-11.3l-28 32.4c6.3 14 17.1 25.8 27.2 36.6L64 71.1c-3.3 3.6-8.1 6-13.5 6.1-.1 0-.2-.1-.3.1z"
          />
          <path
            fill="#34a853"
            d="M59.1 109.2c15.4-24.1 33.3-35 33.3-63 0-7.7-1.9-14.9-5.2-21.3L31.8 103.8c3.7 4.2 7.4 8.1 10.4 11.4 3.9 4.1 6 6.2 6.1 6.2.1 0 3-3.4 7.1-8.5l3.7-3.7z"
          />
        </svg>
        <span
          class="text-sm text-zinc-600 group-hover:text-blue-600 group-hover:underline"
        >
          {MOCK_SHOP.location}
        </span>
      </a>

      <div class="flex items-center gap-2.5">
        <Clock class="size-5 shrink-0 text-zinc-400" />
        <span class="text-sm text-zinc-600">{MOCK_SHOP.openHours}</span>
        <span
          class="size-2 shrink-0 rounded-full {MOCK_SHOP.isOpen
            ? 'bg-emerald-500'
            : 'bg-zinc-400'}"
        ></span>
        <span
          class="text-xs font-medium {MOCK_SHOP.isOpen
            ? 'text-emerald-600'
            : 'text-zinc-500'}"
        >
          {MOCK_SHOP.isOpen ? 'Abierto' : 'Cerrado'}
        </span>
      </div>
    </div>
  </div>
</header>
