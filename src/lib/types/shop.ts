export interface ShopMpTokensUpdate {
  mp_access_token: string;
  mp_refresh_token: string;
  mp_token_expires_at: string;
}

export interface ShopMpOAuthTokensUpdate {
  mp_access_token: string;
  mp_refresh_token: string;
  mp_token_expires_at: string;
  mp_user_id: string;
  mp_public_key: string;
  connected_at: string;
}
