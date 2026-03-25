<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    originLat?: number;
    originLng?: number;
    pricePerKm: number;
    address?: string;
    onResult?: (result: {
      distanceKm: number;
      shippingCost: number;
      lat: number;
      lng: number;
    }) => void;
  }

  let {
    originLat = -31.4201,
    originLng = -64.1888,
    pricePerKm,
    address,
    onResult
  }: Props = $props();

  let mapContainer: HTMLDivElement;
  let loading = $state(false);
  let error = $state('');

  let destLat = $state(originLat);
  let destLng = $state(originLng);

  let markerRef = $state<import('leaflet').Marker | undefined>();
  let mapRef = $state<import('leaflet').Map | undefined>();

  async function geocodeAddress(addr: string) {
    const res = await fetch('/api/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: addr })
    });

    if (!res.ok) {
      return;
    }

    const data = await res.json();

    destLat = data.lat;
    destLng = data.lng;
    markerRef?.setLatLng([data.lat, data.lng]);
    mapRef?.setView([data.lat, data.lng], 16);
  }

  onMount(() => {
    import('leaflet').then((mod) => {
      const L = mod.default;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      mapRef = L.map(mapContainer).setView([originLat, originLng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapRef);

      const icon = L.divIcon({
        html: `<div class="map-marker-pin"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#111827" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      markerRef = L.marker([originLat, originLng], {
        draggable: true,
        icon
      }).addTo(mapRef);

      markerRef.on('dragend', () => {
        const { lat, lng } = markerRef!.getLatLng();
        destLat = lat;
        destLng = lng;
      });

      mapRef.on('click', (e: L.LeafletMouseEvent) => {
        markerRef?.setLatLng(e.latlng);
        destLat = e.latlng.lat;
        destLng = e.latlng.lng;
      });

      if (address && address.trim().length >= 3) {
        geocodeAddress(address);
      }
    });

    return () => {
      mapRef?.remove();
    };
  });

  async function confirmLocation() {
    loading = true;
    error = '';

    try {
      const response = await fetch('/api/delivery-cost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originLat,
          originLng,
          destLat,
          destLng,
          pricePerKm
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al calcular el envío');
      }

      const data = await response.json();
      onResult?.({
        distanceKm: data.distanceKm,
        shippingCost: data.shippingCost,
        lat: destLat,
        lng: destLng
      });
    } catch (err) {
      error = err instanceof Error ? err.message : 'Error inesperado';
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex flex-col gap-3">
  <p class="m-0 text-center text-xs text-gray-500">
    📌 Mové el marcador o tocá el mapa para confirmar tu ubicación de entrega
  </p>

  <div
    bind:this={mapContainer}
    id="leaflet-map"
    class="[z-index:0] h-[280px] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
  ></div>

  <button
    type="button"
    id="btn-confirm-location"
    class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-none bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-[background,opacity] duration-150 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
    onclick={confirmLocation}
    disabled={loading}
  >
    {#if loading}
      <span
        class="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
      ></span>
      Calculando...
    {:else}
      Confirmar ubicación
    {/if}
  </button>

  {#if error}
    <p
      class="m-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-500"
    >
      {error}
    </p>
  {/if}
</div>

<style>
  :global(.map-marker-pin) {
    font-size: 2rem;
    line-height: 1;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    cursor: grab;
    user-select: none;
  }
</style>
