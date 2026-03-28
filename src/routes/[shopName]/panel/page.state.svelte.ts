import { playNotificationSound } from '$lib/notification-sound';
import { OrderRowSchema, OrderStatus } from '$lib/schemas/order';
import type { Order } from '$lib/types/order';

function mapRowToOrder(row: Record<string, unknown>): Order {
  const result = OrderRowSchema.safeParse(row);
  if (!result.success) {
    throw new Error(`Invalid order data: ${result.error.message}`);
  }
  return result.data;
}

export class DashboardState {
  orders = $state<Order[]>([]);
  private eventSource: EventSource | null = null;

  constructor(initialOrders: Order[]) {
    this.orders = initialOrders;
  }

  get pendingOrders() {
    return this.orders.filter((o) => o.status === OrderStatus.enum.pending);
  }

  get confirmedOrders() {
    return this.orders.filter((o) => o.status === OrderStatus.enum.confirmed);
  }

  connect(shopId: number) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(`/api/orders/${shopId}/stream`);

    this.eventSource.addEventListener('new_order', (event) => {
      const row = JSON.parse(event.data);
      const order = mapRowToOrder(row);
      this.orders = [order, ...this.orders];

      playNotificationSound();
    });

    this.eventSource.addEventListener('order_updated', (event) => {
      const row = JSON.parse(event.data);
      const updated = mapRowToOrder(row);
      this.orders = this.orders.map((o) => (o.id === updated.id ? updated : o));
    });

    this.eventSource.addEventListener('error', () => {
      // EventSource auto-reconnects by default
    });
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  removeOrder(orderId: number) {
    this.orders = this.orders.filter((o) => o.id !== orderId);
  }
}
