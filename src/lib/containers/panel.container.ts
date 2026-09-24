import type { SupabaseClient } from "@supabase/supabase-js";
import { ConfirmOrderUseCase } from "@/application/use-cases/confirm-order/confirm-order.use-case";
import { ListOrdersByShopUseCase } from "@/application/use-cases/list-orders-by-shop/list-orders-by-shop.use-case";
import { PanelAuthUseCase } from "@/application/use-cases/panel-auth/panel-auth.use-case";
import { RejectOrderUseCase } from "@/application/use-cases/reject-order/reject-order.use-case";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { SupabaseListOrdersByShopRepository } from "@/infrastructure/database/postgres/repositories/orders/supabase-list-orders-by-shop.repository";
import { SupabaseUpdateOrderStatusRepository } from "@/infrastructure/database/postgres/repositories/orders/supabase-update-order-status.repository";
import { SupabasePanelAuthRepository } from "@/infrastructure/database/postgres/repositories/shops/supabase-panel-auth.repository";
import { verifyPin } from "@/lib/shared/infrastructure/panel-session";

const pinVerifier = { verify: verifyPin };

export function createPanelContainer(supabase: SupabaseClient<Database>) {
  const listOrdersRepository = new SupabaseListOrdersByShopRepository(supabase);
  const updateStatusRepository = new SupabaseUpdateOrderStatusRepository(
    supabase,
  );

  return {
    auth: new PanelAuthUseCase(
      new SupabasePanelAuthRepository(supabase),
      pinVerifier,
    ),
    listOrders: new ListOrdersByShopUseCase(listOrdersRepository),
    confirmOrder: new ConfirmOrderUseCase({
      findByShopId:
        listOrdersRepository.findByShopId.bind(listOrdersRepository),
      updateStatus: updateStatusRepository.updateStatus.bind(
        updateStatusRepository,
      ),
    }),
    rejectOrder: new RejectOrderUseCase({
      findByShopId:
        listOrdersRepository.findByShopId.bind(listOrdersRepository),
      updateStatus: updateStatusRepository.updateStatus.bind(
        updateStatusRepository,
      ),
    }),
  };
}
