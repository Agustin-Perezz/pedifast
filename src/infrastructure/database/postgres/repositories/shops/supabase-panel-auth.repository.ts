import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  PanelAuthRepository,
  ShopPanelCredentials,
} from "@/application/use-cases/panel-auth/panel-auth.repository.interface";
import type { Database } from "../../database.types";

export class SupabasePanelAuthRepository implements PanelAuthRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findPanelCredentialsByShopName(
    shopName: string,
  ): Promise<ShopPanelCredentials | null> {
    const { data, error } = await this.supabase
      .from("shops")
      .select("id, shop_name, dashboard_pin_hash")
      .eq("shop_name", shopName)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      shopName: data.shop_name,
      dashboardPinHash: data.dashboard_pin_hash,
    };
  }
}
