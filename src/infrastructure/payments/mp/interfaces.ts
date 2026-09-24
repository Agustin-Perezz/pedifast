import type {
  MpPreferenceItem,
  MpPreferenceMetadata,
} from "./mp-preference.types";

export type MpOAuthTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly userId: number;
  readonly publicKey: string;
};

export interface MpOAuthClient {
  getAuthorizationUrl(shopName: string): string;
  exchangeCode(code: string): Promise<MpOAuthTokens>;
  refresh(
    refreshToken: string,
  ): Promise<Omit<MpOAuthTokens, "userId" | "publicKey">>;
}

export type MpPreferenceRequest = {
  readonly shopName: string;
  readonly items: readonly MpPreferenceItem[];
  readonly nombre: string;
  readonly notas: string;
  readonly deliveryMethod: string;
  readonly address: string;
  readonly baseUrl: string;
};

export type MpPreferenceResult = {
  readonly initPoint: string;
  readonly preferenceId: string;
  readonly externalReference: string;
};

export interface MpPreferenceClient {
  createWithSellerToken(
    sellerAccessToken: string,
    request: MpPreferenceRequest,
    externalReference: string,
  ): Promise<MpPreferenceResult>;
}

export type MpPaymentStatusResult = {
  readonly status: string;
  readonly externalReference: string | null;
};

export interface MpPaymentClient {
  getPaymentStatusWithSellerToken(
    sellerAccessToken: string,
    paymentId: string,
  ): Promise<MpPaymentStatusResult>;
}

export type { MpPreferenceItem, MpPreferenceMetadata };
