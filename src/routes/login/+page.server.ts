import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { loginSchema } from '$lib/schemas/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(303, '/');
  }

  return {
    form: await superValidate(zod4(loginSchema))
  };
};

export const actions: Actions = {
  login: async ({ request, locals }) => {
    const form = await superValidate(request, zod4(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return message(form, error.message, { status: 400 });
    }

    throw redirect(303, '/');
  },

  google: async ({ locals, url }) => {
    const { data, error } = await locals.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${url.origin}/auth/callback`
      }
    });

    if (error) {
      throw redirect(303, `/?error=${encodeURIComponent(error.message)}`);
    }

    throw redirect(303, data.url);
  },

  facebook: async ({ locals, url }) => {
    const { data, error } = await locals.supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${url.origin}/auth/callback`
      }
    });

    if (error) {
      throw redirect(303, `/?error=${encodeURIComponent(error.message)}`);
    }

    throw redirect(303, data.url);
  }
};
