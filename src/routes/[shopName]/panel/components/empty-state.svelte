<script lang="ts">
  import ClipboardList from '@lucide/svelte/icons/clipboard-list';
</script>

<div class="flex flex-col items-center gap-3 py-16 text-center">
  <div
    class="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100"
  >
    <ClipboardList class="h-6 w-6 text-zinc-400" />
  </div>
  <p class="text-sm text-zinc-500">No hay pedidos pendientes</p>
  <p class="text-xs text-zinc-400">
    Los nuevos pedidos aparecerán aquí en tiempo real.
  </p>
</div>
