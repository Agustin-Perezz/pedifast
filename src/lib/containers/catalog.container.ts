import type { SupabaseClient } from "@supabase/supabase-js";
import { GetAccessoryGroupsByItemIdsUseCase } from "@/application/use-cases/get-accessory-groups-by-item-ids/get-accessory-groups-by-item-ids.use-case";
import { GetShopCatalogUseCase } from "@/application/use-cases/get-shop-catalog/get-shop-catalog.use-case";
import { GetShopItemByIdUseCase } from "@/application/use-cases/get-shop-item-by-id/get-shop-item-by-id.use-case";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { SupabaseGetAccessoryGroupsByItemIdsRepository } from "@/infrastructure/database/postgres/repositories/accessories/supabase-get-accessory-groups-by-item-ids.repository";
import { SupabaseGetShopItemByIdRepository } from "@/infrastructure/database/postgres/repositories/shop-items/supabase-get-shop-item-by-id.repository";
import { SupabaseGetShopCatalogRepository } from "@/infrastructure/database/postgres/repositories/shops/supabase-get-shop-catalog.repository";

export function createCatalogContainer(supabase: SupabaseClient<Database>) {
  return {
    getShopCatalog: new GetShopCatalogUseCase(
      new SupabaseGetShopCatalogRepository(supabase),
    ),
    getShopItemById: new GetShopItemByIdUseCase(
      new SupabaseGetShopItemByIdRepository(supabase),
    ),
    getAccessoryGroupsByItemIds: new GetAccessoryGroupsByItemIdsUseCase(
      new SupabaseGetAccessoryGroupsByItemIdsRepository(supabase),
    ),
  };
}
