import { json } from '@sveltejs/kit';

import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_BASE_URL } from '$lib/server/env';

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { originLat, originLng, destLat, destLng, pricePerKm } = body;

    if (!originLat || !originLng || !destLat || !destLng) {
      return json({ error: 'Missing coordinates' }, { status: 400 });
    }

    if (typeof pricePerKm !== 'number' || pricePerKm <= 0) {
      return json({ error: 'Missing or invalid pricePerKm' }, { status: 400 });
    }

    const params = new URLSearchParams({
      origins: `${originLat},${originLng}`,
      destinations: `${destLat},${destLng}`,
      mode: 'driving',
      key: GOOGLE_MAPS_API_KEY
    });

    const response = await fetch(
      `${GOOGLE_MAPS_BASE_URL}/distancematrix/json?${params}`
    );

    if (!response.ok) {
      return json(
        { error: 'Google Maps API error' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const element = data.rows?.[0]?.elements?.[0];

    if (!element || element.status !== 'OK') {
      return json({ error: 'No routes found' }, { status: 404 });
    }

    const distanceMeters: number = element.distance.value;
    const distanceKm = distanceMeters / 1000;
    const shippingCost = Math.round(distanceKm * pricePerKm);

    return json({
      distanceMeters,
      distanceKm: Number(distanceKm.toFixed(2)),
      shippingCost
    });
  } catch (err) {
    console.error('Error in delivery-cost API:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
