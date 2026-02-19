import { json } from '@sveltejs/kit';
import { z } from 'zod';

import { MP_API_BASE_URL } from '$lib/server/env';
import { getSellerAccessToken } from '$lib/server/mp-token';
import type { RequestHandler } from './$types';

const preferenceSchema = z.object({
  shopName: z.string().min(1),
  nombre: z.string().min(1),
  notas: z.string().optional(),
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

  const { shopName, nombre, notas, items } = parsed.data;

  let accessToken: string;
  try {
    accessToken = await getSellerAccessToken(shopName);
  } catch (err) {
    console.error('Failed to get seller access token:', err);
    return json(
      { error: 'Shop not connected to Mercado Pago' },
      { status: 422 }
    );
  }

  const externalReference = `${shopName}-${Date.now()}`;
  const baseUrl = url.origin;
  const resultUrl = `${baseUrl}/pedido/resultado`;

  const preferenceBody: Record<string, unknown> = {
    items: items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: item.currency_id
    })),
    external_reference: externalReference,
    metadata: {
      shop_name: shopName,
      nombre,
      notas: notas ?? ''
    }
  };

  if (!baseUrl.includes('localhost')) {
    preferenceBody.back_urls = {
      success: resultUrl,
      failure: resultUrl,
      pending: resultUrl
    };
    preferenceBody.auto_return = 'approved';
  }

  const mpResponse = await fetch(`${MP_API_BASE_URL}/checkout/preferences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(preferenceBody)
  });

  if (!mpResponse.ok) {
    const errorText = await mpResponse.text();
    console.error('MP preference creation failed:', errorText);
    return json(
      { error: 'Failed to create payment preference' },
      { status: 502 }
    );
  }

  const preference = await mpResponse.json();

  return json({
    init_point: preference.init_point,
    preference_id: preference.id
  });
};
