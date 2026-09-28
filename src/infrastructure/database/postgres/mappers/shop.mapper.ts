import type { OrderFlow } from "@/domain/entities/order-flow.enum";
import { Shop } from "@/domain/entities/shop.entity";
import type { ShopInsert, ShopRow } from "../entities/shop.entity";

export const shopMapper = {
  toDomain(row: ShopRow): Shop {
    return Shop.create({
      id: row.id,
      shopName: row.shop_name,
      address: row.address,
      deliveryPrice: row.delivery_price,
      whatsappPhone: row.whatsapp_phone,
      displayName: row.display_name,
      logoUrl: row.logo_url,
      portraitUrl: row.portrait_url,
      openHours: row.open_hours,
      lat: row.lat,
      lng: row.lng,
      pricePerKm: row.price_per_km,
      orderFlow: row.order_flow as OrderFlow,
      dashboardPinHash: row.dashboard_pin_hash,
      mpAccessToken: row.mp_access_token,
      mpRefreshToken: row.mp_refresh_token,
      mpTokenExpiresAt: row.mp_token_expires_at,
      mpUserId: row.mp_user_id,
      mpPublicKey: row.mp_public_key,
      connectedAt: row.connected_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  },

  toPersistence(shop: Shop): ShopInsert {
    const props = shop.toObject();
    return {
      shop_name: props.shopName,
      address: props.address,
      delivery_price: props.deliveryPrice,
      whatsapp_phone: props.whatsappPhone,
      display_name: props.displayName,
      logo_url: props.logoUrl,
      portrait_url: props.portraitUrl,
      open_hours: props.openHours,
      lat: props.lat,
      lng: props.lng,
      price_per_km: props.pricePerKm,
      order_flow: props.orderFlow,
      dashboard_pin_hash: props.dashboardPinHash,
      mp_access_token: props.mpAccessToken,
      mp_refresh_token: props.mpRefreshToken,
      mp_token_expires_at: props.mpTokenExpiresAt,
      mp_user_id: props.mpUserId,
      mp_public_key: props.mpPublicKey,
      connected_at: props.connectedAt,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
    };
  },
};
