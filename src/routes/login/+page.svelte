<script lang="ts">
  import { Button } from '$components/ui/button';
  import { FormField } from '$components/ui/form-field';
  import { superForm } from 'sveltekit-superforms';

  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const { form, errors, enhance, message } = superForm(data.form);
</script>

<div class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Sign In</h1>
      <p class="text-muted-foreground mt-2">
        Welcome back! Please sign in to continue.
      </p>
    </div>

    {#if $message}
      <div
        class="bg-destructive/10 text-destructive border-destructive rounded-lg border px-4 py-3"
        role="alert"
      >
        <p class="text-sm font-medium">{$message}</p>
      </div>
    {/if}

    <div class="space-y-3">
      <form method="POST" action="?/google">
        <Button type="submit" variant="outline" class="w-full">
          Continue with Google
        </Button>
      </form>

      <form method="POST" action="?/facebook">
        <Button type="submit" variant="outline" class="w-full">
          Continue with Facebook
        </Button>
      </form>
    </div>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t"></span>
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background text-muted-foreground px-2"
          >Or continue with</span
        >
      </div>
    </div>

    <form method="POST" action="?/login" use:enhance class="space-y-4">
      <FormField
        label="Email"
        name="email"
        type="email"
        bind:value={$form.email}
        error={$errors.email}
        autocomplete="email"
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        bind:value={$form.password}
        error={$errors.password}
        autocomplete="current-password"
      />

      <Button type="submit" class="w-full">Sign In</Button>
    </form>

    <p class="text-muted-foreground text-center text-sm">
      Don't have an account?
      <a href="/signup" class="text-primary underline-offset-4 hover:underline"
        >Sign up</a
      >
    </p>
  </div>
</div>
