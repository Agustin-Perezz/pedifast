import { ShopNotFoundError } from "@/domain/entities/errors";
import type { OrderFlow } from "@/domain/entities/order-flow.enum";
import { createCatalogContainer } from "@/lib/containers/catalog.container";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

type GetShopCatalogResult = Awaited<ReturnType<typeof fetchCatalog>>;

type ShopOrderFlow = {
  readonly shopId: number;
  readonly orderFlow: OrderFlow;
};

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

export async function getShopOrderFlow(
  shopName: string,
): Promise<ShopOrderFlow | null> {
  const { catalog } = await getShopCatalog(shopName);

  if (!catalog) {
    return null;
  }

  return { shopId: catalog.shop.id, orderFlow: catalog.shop.orderFlow };
}
