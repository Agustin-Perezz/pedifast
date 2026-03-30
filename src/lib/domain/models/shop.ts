import type { OrderFlowValue } from '$schemas/order';

export interface Shop {
  address: string | null;
  deliveryPrice: number | null;
  whatsappPhone: string;
  displayName: string | null;
  logoUrl: string | null;
  portraitUrl: string | null;
  openHours: string | null;
  lat: number;
  lng: number;
  pricePerKm: number;
  orderFlow: OrderFlowValue;
}

export interface ShopMpTokensUpdate {
  mp_access_token: string;
  mp_refresh_token: string;
  mp_token_expires_at: string;
}
