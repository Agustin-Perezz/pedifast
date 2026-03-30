import type { Shop } from '$domain/models/shop';
import type { OrderFlowValue } from '$schemas/order';

interface ShopEntity {
  address: string | null;
  delivery_price: number | null;
  whatsapp_phone: string;
  display_name: string | null;
  logo_url: string | null;
  portrait_url: string | null;
  open_hours: string | null;
  lat: number;
  lng: number;
  price_per_km: number;
  order_flow: string;
}

export class ShopMapper {
  static fromEntityToShop(entity: ShopEntity): Shop {
    return {
      address: entity.address ?? null,
      deliveryPrice:
        entity.delivery_price != null ? Number(entity.delivery_price) : null,
      whatsappPhone: entity.whatsapp_phone,
      displayName: entity.display_name ?? null,
      logoUrl: entity.logo_url ?? null,
      portraitUrl: entity.portrait_url ?? null,
      openHours: entity.open_hours ?? null,
      lat: Number(entity.lat),
      lng: Number(entity.lng),
      pricePerKm: Number(entity.price_per_km),
      orderFlow: (entity.order_flow ?? 'whatsapp') as OrderFlowValue
    } satisfies Shop;
  }
}
