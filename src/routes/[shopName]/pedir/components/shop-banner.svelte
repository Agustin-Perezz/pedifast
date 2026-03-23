<script lang="ts">
  interface Props {
    name: string;
    portraitUrl: string | null;
    logoUrl: string | null;
  }

  let { name, portraitUrl, logoUrl }: Props = $props();
</script>

<div class="relative h-44 w-full overflow-hidden bg-zinc-300 sm:h-52">
  {#if portraitUrl}
    <img
      src={portraitUrl}
      alt="{name} portrait"
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
    {#if logoUrl}
      <img src={logoUrl} alt="{name} logo" class="h-full w-full object-cover" />
    {:else}
      <div
        class="flex h-full w-full items-center justify-center text-2xl font-black text-zinc-400"
      >
        {name[0]}
      </div>
    {/if}
  </div>
</div>
