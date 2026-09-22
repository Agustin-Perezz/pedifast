import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  MpTokensUpdate,
  UpdateShopMpTokensRepository,
} from "@/application/use-cases/update-shop-mp-tokens/update-shop-mp-tokens.repository.interface";
import type { Shop } from "@/domain/entities/shop.entity";
import type { Database } from "../../database.types";
import { shopMapper } from "../../mappers/shop.mapper";

export class SupabaseUpdateShopMpTokensRepository
  implements UpdateShopMpTokensRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async updateByShopName(
    shopName: string,
    tokens: MpTokensUpdate,
  ): Promise<Shop | null> {
    const { data, error } = await this.supabase
      .from("shops")
      .update({
        mp_access_token: tokens.mpAccessToken,
        mp_refresh_token: tokens.mpRefreshToken,
        mp_token_expires_at: tokens.mpTokenExpiresAt,
        mp_user_id: tokens.mpUserId,
        mp_public_key: tokens.mpPublicKey,
        connected_at: tokens.connectedAt,
      })
      .eq("shop_name", shopName)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return shopMapper.toDomain(data);
  }
}
