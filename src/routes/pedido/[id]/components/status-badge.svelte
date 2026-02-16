<script lang="ts">
  import { Badge } from '$components/ui/badge';

  let verified = $state(false);

  $effect(() => {
    const timeout = setTimeout(() => {
      verified = true;
    }, 2000);
    return () => clearTimeout(timeout);
  });
</script>

{#if verified}
  <Badge class="border-transparent bg-emerald-500 text-white"
    >Pago Verificado</Badge
  >
{:else}
  <Badge variant="secondary">Procesando...</Badge>
{/if}
