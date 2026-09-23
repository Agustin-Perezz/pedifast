import { z } from "zod";

export const calculateDeliveryCostRequestDto = z.object({
  originLat: z.number(),
  originLng: z.number(),
  destLat: z.number(),
  destLng: z.number(),
  pricePerKm: z.number().positive("pricePerKm must be greater than 0"),
});

export type CalculateDeliveryCostRequestDto = z.infer<
  typeof calculateDeliveryCostRequestDto
>;
