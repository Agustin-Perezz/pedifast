import { json } from '@sveltejs/kit';
import { z } from 'zod';

import { mpService } from '$lib/server/mp-client';
import type { RequestHandler } from './$types';

const preferenceSchema = z.object({
  shopName: z.string().min(1),
  nombre: z.string().min(1),
  notas: z.string().optional(),
  deliveryMethod: z.enum(['pickup', 'delivery']),
  address: z.string().optional(),
  items: z
    .array(
      z.object({
        title: z.string(),
        quantity: z.number().int().positive(),
        unit_price: z.number().positive(),
        currency_id: z.string().default('ARS')
      })
    )
    .min(1)
});

export const POST: RequestHandler = async ({ request, url }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = preferenceSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { shopName, nombre, notas, deliveryMethod, address, items } =
    parsed.data;

  try {
    const result = await mpService.createPreference({
      shopName,
      items,
      nombre,
      notas: notas ?? '',
      deliveryMethod,
      address: address ?? '',
      baseUrl: url.origin
    });

    return json(result);
  } catch (err) {
    console.error('MP preference creation failed:', err);
    return json(
      { error: 'Failed to create payment preference' },
      { status: 502 }
    );
  }
};
