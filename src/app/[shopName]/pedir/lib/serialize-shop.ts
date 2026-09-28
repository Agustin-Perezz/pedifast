import type { Shop } from "@/domain/entities/shop.entity";

export type PlainShop = {
  readonly shopName: string;
  readonly displayName: string | null;
  readonly address: string;
  readonly whatsappPhone: string;
  readonly orderFlow: "whatsapp" | "dashboard";
  readonly deliveryPrice: number | null;
  readonly pricePerKm: number;
  readonly openHours: string | null;
  readonly logoUrl: string | null;
  readonly portraitUrl: string | null;
};

export function serializeShop(shop: Shop, shopName: string): PlainShop {
  return {
    shopName,
    displayName: shop.displayName,
    address: shop.address,
    whatsappPhone: shop.whatsappPhone,
    orderFlow: shop.orderFlow,
    deliveryPrice: shop.deliveryPrice,
    pricePerKm: shop.pricePerKm,
    openHours: shop.openHours,
    logoUrl: shop.logoUrl,
    portraitUrl: shop.portraitUrl,
  };
}
