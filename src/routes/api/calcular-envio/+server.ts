import { json } from '@sveltejs/kit';

import { MAPBOX_ACCESS_TOKEN, MAPBOX_BASE_URL } from '$lib/server/env';

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { originLat, originLng, destLat, destLng } = body;

    if (!originLat || !originLng || !destLat || !destLng) {
      return json({ error: 'Missing coordinates' }, { status: 400 });
    }

    const url = `${MAPBOX_BASE_URL}/directions/v5/mapbox/driving/${originLng},${originLat};${destLng},${destLat}?access_token=${MAPBOX_ACCESS_TOKEN}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return json(
        { error: 'Mapbox API error', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return json({ error: 'No routes found' }, { status: 404 });
    }

    const distanceMeters = data.routes[0].distance;
    const distanceKm = distanceMeters / 1000;

    const shippingCost = Math.round(500 + distanceKm * 300);

    return json({
      distanceMeters,
      distanceKm: Number(distanceKm.toFixed(2)),
      shippingCost
    });
  } catch (err) {
    console.error('Error in calcular-envio API:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
