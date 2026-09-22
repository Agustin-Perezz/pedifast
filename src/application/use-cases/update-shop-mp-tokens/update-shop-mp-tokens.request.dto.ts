import { z } from "zod";

export const updateShopMpTokensRequestDto = z.object({
  shopName: z.string().min(1),
  mpAccessToken: z.string().min(1),
  mpRefreshToken: z.string().min(1),
  mpTokenExpiresAt: z.string().min(1),
  mpUserId: z.string().min(1),
  mpPublicKey: z.string().min(1),
  connectedAt: z.string().min(1),
});

export type UpdateShopMpTokensRequestDto = z.infer<
  typeof updateShopMpTokensRequestDto
>;
