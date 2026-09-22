import { createCatalogContainer } from "@/lib/containers/catalog.container";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function getShopItemDetail(itemId: number) {
  const supabase = await createSupabaseServerClient();
  const container = createCatalogContainer(supabase);

  return container.getShopItemById.execute({ itemId });
}
