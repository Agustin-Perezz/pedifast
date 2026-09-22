import { ShopNotFoundError } from "@/domain/entities/errors";
import { createCatalogContainer } from "@/lib/containers/catalog.container";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

type GetShopCatalogResult = Awaited<ReturnType<typeof fetchCatalog>>;

async function fetchCatalog(shopName: string) {
  const supabase = await createSupabaseServerClient();
  const container = createCatalogContainer(supabase);

  return container.getShopCatalog.execute({ shopName });
}

export async function getShopCatalog(
  shopName: string,
): Promise<GetShopCatalogResult | { catalog: null }> {
  try {
    return await fetchCatalog(shopName);
  } catch (error) {
    if (error instanceof ShopNotFoundError) {
      return { catalog: null };
    }
    throw error;
  }
}
