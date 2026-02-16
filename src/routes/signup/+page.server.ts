import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { signupSchema } from '$lib/schemas/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(303, '/');
  }

  return {
    form: await superValidate(zod4(signupSchema))
  };
};

export const actions: Actions = {
  default: async ({ request, locals, url }) => {
    const form = await superValidate(request, zod4(signupSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;

    const { error } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${url.origin}/auth/callback`
      }
    });

    if (error) {
      return message(form, error.message, { status: 400 });
    }

    return {
      form,
      success: true
    };
  }
};
