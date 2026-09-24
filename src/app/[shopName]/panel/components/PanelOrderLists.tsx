import type { PlainPanelOrder } from "../lib/serialize-panel-order";

import { PanelEmptyState } from "./PanelEmptyState";
import { PanelOrderList } from "./PanelOrderList";

type PanelOrderListsProps = {
  readonly shopName: string;
  readonly pending: readonly PlainPanelOrder[];
  readonly confirmed: readonly PlainPanelOrder[];
};

export function PanelOrderLists({
  shopName,
  pending,
  confirmed,
}: PanelOrderListsProps) {
  if (pending.length === 0 && confirmed.length === 0) {
    return <PanelEmptyState />;
  }

  return (
    <>
      <PanelOrderList
        shopName={shopName}
        title="Pendientes"
        orders={pending}
        variant="pending"
      />
      <PanelOrderList
        shopName={shopName}
        title="Confirmados"
        orders={confirmed}
        variant="confirmed"
      />
    </>
  );
}
