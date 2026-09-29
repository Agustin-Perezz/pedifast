import type { RealtimeChannel } from "@supabase/supabase-js";

import type { Order } from "@/domain/entities/order.entity";
import type { OrderRow } from "@/infrastructure/database/postgres/entities/order.entity";
import { orderMapper } from "@/infrastructure/database/postgres/mappers/order.mapper";
import { ORDER_STREAM_EVENT_NAMES } from "@/lib/shared/infrastructure/order-stream-events";
import { getSupabaseServiceRoleClient } from "@/lib/shared/infrastructure/supabase.service-role";

export { ORDER_STREAM_EVENT_NAMES } from "@/lib/shared/infrastructure/order-stream-events";

export type OrderStreamEvent =
  | {
      readonly type: typeof ORDER_STREAM_EVENT_NAMES.NewOrder;
      readonly order: Order;
    }
  | {
      readonly type: typeof ORDER_STREAM_EVENT_NAMES.OrderUpdated;
      readonly order: Order;
    };

type OrderListener = (event: OrderStreamEvent) => void;

type ShopStreamHub = {
  readonly channel: RealtimeChannel;
  readonly listeners: Set<OrderListener>;
};

// Module-level fan-out registry: one Realtime subscription per shop shared by
// every SSE client connected to that shop's stream.
const hubs = new Map<number, ShopStreamHub>();

function sendToShop(shopId: number, event: OrderStreamEvent): void {
  const hub = hubs.get(shopId);
  if (!hub) {
    return;
  }

  for (const listener of hub.listeners) {
    listener(event);
  }
}

function ensureHub(shopId: number): ShopStreamHub {
  const existing = hubs.get(shopId);
  if (existing) {
    return existing;
  }

  const supabase = getSupabaseServiceRoleClient();
  const listeners = new Set<OrderListener>();
  const channel = supabase
    .channel(`orders-stream-shop-${shopId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "orders",
        filter: `shop_id=eq.${shopId}`,
      },
      (payload) => {
        sendToShop(shopId, {
          type: ORDER_STREAM_EVENT_NAMES.NewOrder,
          order: orderMapper.toDomain(payload.new as OrderRow),
        });
      },
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `shop_id=eq.${shopId}`,
      },
      (payload) => {
        sendToShop(shopId, {
          type: ORDER_STREAM_EVENT_NAMES.OrderUpdated,
          order: orderMapper.toDomain(payload.new as OrderRow),
        });
      },
    )
    .subscribe();

  const hub: ShopStreamHub = { channel, listeners };
  hubs.set(shopId, hub);

  return hub;
}

export function subscribeToShopOrders(
  shopId: number,
  listener: OrderListener,
): () => void {
  const hub = ensureHub(shopId);
  hub.listeners.add(listener);

  return () => {
    hub.listeners.delete(listener);

    if (hub.listeners.size === 0) {
      const supabase = getSupabaseServiceRoleClient();
      void supabase.removeChannel(hub.channel);
      hubs.delete(shopId);
    }
  };
}
