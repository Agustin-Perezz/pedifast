import { z } from "zod";

export const DEFAULT_CITY = "Esperanza";
export const DEFAULT_PROVINCE = "Santa Fe";
export const COUNTRY_FILTER = "country:AR";
export const GEOCODING_LANGUAGE = "es";

export const geocodeAddressRequestDto = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  province: z.string().optional(),
});

export type GeocodeAddressRequestDto = z.infer<typeof geocodeAddressRequestDto>;
