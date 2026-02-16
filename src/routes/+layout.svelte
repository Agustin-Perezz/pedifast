<script lang="ts">
  import '../app.css';

  import { onMount } from 'svelte';
  import { invalidate } from '$app/navigation';
  import { Toaster } from 'svelte-french-toast';

  import { createBrowserClient } from '$lib/supabase';

  let { children } = $props();

  onMount(() => {
    const supabase = createBrowserClient();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      invalidate('supabase:auth');
    });

    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<Toaster />
{@render children()}
