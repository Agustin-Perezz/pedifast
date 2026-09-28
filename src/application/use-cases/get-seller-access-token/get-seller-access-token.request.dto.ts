import { z } from "zod";

export const getSellerAccessTokenRequestDto = z.object({
  shopName: z.string().min(1),
});

export type GetSellerAccessTokenRequestDto = z.infer<
  typeof getSellerAccessTokenRequestDto
>;
