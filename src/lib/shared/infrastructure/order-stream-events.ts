// Single source of truth for SSE event names: the order stream route emits
// these values and the panel client listens for them. Renaming a member
// updates both sides. This module must stay dependency-free so client code
// can import it without pulling server infrastructure into the bundle.
export const ORDER_STREAM_EVENT_NAMES = {
  NewOrder: "new_order",
  OrderUpdated: "order_updated",
} as const;

export type OrderStreamEventType =
  (typeof ORDER_STREAM_EVENT_NAMES)[keyof typeof ORDER_STREAM_EVENT_NAMES];
