import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GetShopMpTokensRepository,
  RefreshMpTokensRepository,
  ShopMpTokens,
} from "@/application/use-cases/get-seller-access-token/get-seller-access-token.repository.interface";
import type { Database } from "../../database.types";

export class SupabaseShopMpTokensRepository
  implements GetShopMpTokensRepository, RefreshMpTokensRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findMpTokensByShopName(shopName: string): Promise<ShopMpTokens | null> {
    const { data, error } = await this.supabase
      .from("shops")
      .select("mp_access_token, mp_refresh_token, mp_token_expires_at")
      .eq("shop_name", shopName)
      .single();

    if (error || !data) {
      return null;
    }

    const accessToken = data.mp_access_token;
    const refreshToken = data.mp_refresh_token;
    const expiresAt = data.mp_token_expires_at;

    if (!accessToken || !refreshToken || !expiresAt) {
      return null;
    }

    return { accessToken, refreshToken, expiresAt };
  }

  async updateRefreshedTokens(
    shopName: string,
    tokens: ShopMpTokens,
  ): Promise<null> {
    const { error } = await this.supabase
      .from("shops")
      .update({
        mp_access_token: tokens.accessToken,
        mp_refresh_token: tokens.refreshToken,
        mp_token_expires_at: tokens.expiresAt,
      })
      .eq("shop_name", shopName);

    if (error) {
      throw new Error(`Failed to update refreshed MP tokens: ${error.message}`);
    }

    return null;
  }
}
