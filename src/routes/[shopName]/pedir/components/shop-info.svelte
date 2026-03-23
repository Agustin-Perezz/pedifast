<script lang="ts">
  import Clock from '@lucide/svelte/icons/clock';
  import MapPin from '@lucide/svelte/icons/map-pin';

  interface Props {
    name: string;
    address: string | null;
    openHours: string | null;
  }

  let { name, address, openHours }: Props = $props();
</script>

<div class="mx-auto max-w-lg px-5 pt-14 pb-4 md:max-w-3xl lg:max-w-5xl">
  <h1 class="text-xl font-bold text-zinc-900">{name}</h1>

  <div class="mt-3 flex flex-col gap-2.5">
    {#if address}
      <a
        href="https://www.google.com/maps/search/?api=1&query={encodeURIComponent(
          address
        )}"
        target="_blank"
        rel="noopener noreferrer"
        class="group flex items-center gap-2.5"
      >
        <MapPin class="size-5 shrink-0 text-red-500" />
        <span
          class="text-sm text-zinc-600 group-hover:text-blue-600 group-hover:underline"
        >
          {address}
        </span>
      </a>
    {/if}

    {#if openHours}
      <div class="flex items-center gap-2.5">
        <Clock class="size-5 shrink-0 text-zinc-400" />
        <span class="text-sm text-zinc-600">{openHours}</span>
      </div>
    {/if}
  </div>
</div>
