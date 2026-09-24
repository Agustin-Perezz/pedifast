import { OrderStatus } from "@/domain/entities/order-status.enum";
import { requirePanelSession } from "@/lib/shared/infrastructure/panel-auth.server";

import { PanelOrderLists } from "./components/PanelOrderLists";
import { PanelShell } from "./components/PanelShell";
import { serializePanelOrder } from "./lib/serialize-panel-order";
import { listShopOrders } from "./queries";

export default async function PanelPage({
  params,
}: {
  params: Promise<{ shopName: string }>;
}) {
  const { shopName } = await params;
  const session = await requirePanelSession(shopName);
  const orders = await listShopOrders(session.shopId);

  const pending = orders
    .filter((order) => order.status === OrderStatus.Pending)
    .map(serializePanelOrder);
  const confirmed = orders
    .filter((order) => order.status === OrderStatus.Confirmed)
    .map(serializePanelOrder);

  return (
    <PanelShell shopName={shopName}>
      <PanelOrderLists
        shopName={shopName}
        pending={pending}
        confirmed={confirmed}
      />
    </PanelShell>
  );
}
