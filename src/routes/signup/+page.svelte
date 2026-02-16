<script lang="ts">
  import { Button } from '$components/ui/button';
  import { FormField } from '$components/ui/form-field';
  import { superForm } from 'sveltekit-superforms';

  import type { ActionData, PageData } from './$types';

  let { data, form: actionData }: { data: PageData; form: ActionData } =
    $props();

  const { form, errors, enhance, message } = superForm(data.form);
</script>

<div class="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Create Account</h1>
      <p class="text-muted-foreground mt-2">
        Enter your details to create an account.
      </p>
    </div>

    {#if actionData?.success}
      <div class="bg-muted rounded-md p-4 text-center">
        <p class="text-sm font-medium">Check your email!</p>
        <p class="text-muted-foreground mt-1 text-sm">
          We've sent you a confirmation link. Please check your inbox.
        </p>
      </div>
    {:else}
      {#if $message}
        <div
          class="bg-destructive/10 text-destructive border-destructive rounded-lg border px-4 py-3"
          role="alert"
        >
          <p class="text-sm font-medium">{$message}</p>
        </div>
      {/if}

      <form method="POST" use:enhance class="space-y-4">
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
          autocomplete="new-password"
        />

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          bind:value={$form.confirmPassword}
          error={$errors.confirmPassword}
          autocomplete="new-password"
        />

        <Button type="submit" class="w-full">Create Account</Button>
      </form>

      <p class="text-muted-foreground text-center text-sm">
        Already have an account?
        <a href="/login" class="text-primary underline-offset-4 hover:underline"
          >Sign in</a
        >
      </p>
    {/if}
  </div>
</div>
