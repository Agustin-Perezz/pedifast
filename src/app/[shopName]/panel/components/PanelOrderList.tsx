import type { PlainPanelOrder } from "../lib/serialize-panel-order";

import { PanelOrderCard } from "./PanelOrderCard";

type PanelOrderListVariant = "pending" | "confirmed";

type PanelOrderListProps = {
  readonly shopName: string;
  readonly title: string;
  readonly orders: readonly PlainPanelOrder[];
  readonly variant: PanelOrderListVariant;
};

export function PanelOrderList({
  shopName,
  title,
  orders,
  variant,
}: PanelOrderListProps) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase">
        {title} ({orders.length})
      </h2>
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <PanelOrderCard
            key={order.id}
            shopName={shopName}
            order={order}
            variant={variant}
          />
        ))}
      </div>
    </section>
  );
}
