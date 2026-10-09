import { z } from "zod";
import { OrderFlow } from "./order-flow.enum";

export const shopSchema = z.object({
  id: z.number().int().nonnegative(),
  shopName: z.string().min(1),
  address: z.string().min(1),
  deliveryPrice: z.number().nullable(),
  whatsappPhone: z.string().min(1),
  displayName: z.string().nullable(),
  logoUrl: z.string().nullable(),
  portraitUrl: z.string().nullable(),
  openHours: z.string().nullable(),
  lat: z.coerce.number().default(0),
  lng: z.coerce.number().default(0),
  pricePerKm: z.coerce.number().default(0),
  orderFlow: z.enum(OrderFlow),
  dashboardPinHash: z.string().nullable(),
  mpAccessToken: z.string().nullable(),
  mpRefreshToken: z.string().nullable(),
  mpTokenExpiresAt: z.string().nullable(),
  mpUserId: z.string().nullable(),
  mpPublicKey: z.string().nullable(),
  connectedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ShopSchema = z.infer<typeof shopSchema>;
