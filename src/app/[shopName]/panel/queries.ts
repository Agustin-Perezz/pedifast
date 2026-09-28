import type { Order } from "@/domain/entities/order.entity";
import { createPanelContainer } from "@/lib/containers/panel.container";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function listShopOrders(shopId: number): Promise<Order[]> {
  const supabase = await createSupabaseServerClient();
  const container = createPanelContainer(supabase);

  const result = await container.listOrders.execute({ shopId });

  return result.orders;
}
