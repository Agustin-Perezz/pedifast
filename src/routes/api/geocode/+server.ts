import { json } from '@sveltejs/kit';

import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_BASE_URL } from '$lib/server/env';

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { address, city = 'Esperanza', province = 'Santa Fe' } = body;

    if (!address || typeof address !== 'string') {
      return json({ error: 'Missing address' }, { status: 400 });
    }

    const fullQuery = `${address}, ${city}, ${province}, Argentina`;

    const params = new URLSearchParams({
      address: fullQuery,
      key: GOOGLE_MAPS_API_KEY,
      components: 'country:AR',
      language: 'es'
    });

    const response = await fetch(
      `${GOOGLE_MAPS_BASE_URL}/geocode/json?${params}`
    );

    if (!response.ok) {
      return json(
        { error: 'Google Maps API error' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.results?.length) {
      return json({ error: 'Address not found' }, { status: 404 });
    }

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;

    return json({ lat, lng, cityMatch: true });
  } catch (err) {
    console.error('Error in geocode API:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
