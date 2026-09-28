import type { MpPreferenceResult } from "@/infrastructure/payments/mp/interfaces";

export type CreateMpPreferenceRepository = {
  getSellerAccessToken(shopName: string): Promise<string>;
  createPreference(
    sellerAccessToken: string,
    request: unknown,
    externalReference: string,
  ): Promise<MpPreferenceResult>;
};
