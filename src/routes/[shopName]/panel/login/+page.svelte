<script lang="ts">
  import { enhance } from '$app/forms';

  import { Button } from '$lib/components/ui/button';
  import { FormField } from '$lib/components/ui/form-field';

  const { form } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
  <div class="w-full max-w-sm">
    <div class="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 class="mb-1 text-lg font-semibold text-zinc-950">Panel del local</h1>
      <p class="mb-6 text-sm text-zinc-500">
        Ingresá el PIN para acceder al panel de pedidos.
      </p>

      <form method="POST" use:enhance class="flex flex-col gap-4">
        <FormField
          label="PIN"
          name="pin"
          type="password"
          inputmode="numeric"
          autocomplete="off"
          maxlength={6}
          placeholder="Ingresá el PIN"
          error={form?.error}
          class="text-center text-lg tracking-widest"
        />

        <Button type="submit" class="w-full">Ingresar</Button>
      </form>
    </div>
  </div>
</div>
