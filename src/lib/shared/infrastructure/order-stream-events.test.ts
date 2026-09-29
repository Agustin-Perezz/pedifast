import { describe, expect, it } from "vitest";
import {
  ORDER_STREAM_EVENT_NAMES,
  type OrderStreamEventType,
} from "./order-stream-events";

const WIRE_VALUES = {
  newOrder: "new_order",
  orderUpdated: "order_updated",
} as const;

const TYPE_EXAMPLES: OrderStreamEventType[] = [
  ORDER_STREAM_EVENT_NAMES.NewOrder,
  ORDER_STREAM_EVENT_NAMES.OrderUpdated,
];

describe("ORDER_STREAM_EVENT_NAMES", () => {
  it("exposes the new order event name", () => {
    expect(ORDER_STREAM_EVENT_NAMES.NewOrder).toBe(WIRE_VALUES.newOrder);
  });

  it("exposes the order updated event name", () => {
    expect(ORDER_STREAM_EVENT_NAMES.OrderUpdated).toBe(
      WIRE_VALUES.orderUpdated,
    );
  });

  it("documents exactly the two emitted events", () => {
    expect(Object.keys(ORDER_STREAM_EVENT_NAMES)).toHaveLength(2);
  });

  it("uses snake_case wire values distinct from the camelCase member names", () => {
    expect(ORDER_STREAM_EVENT_NAMES.NewOrder).toMatch(/^[a-z]+(_[a-z]+)+$/);
    expect(ORDER_STREAM_EVENT_NAMES.NewOrder).not.toBe("NewOrder");
  });

  it("keeps wire values unique so listeners can switch on them", () => {
    const values = Object.values(ORDER_STREAM_EVENT_NAMES);

    expect(new Set(values).size).toBe(values.length);
  });
});

describe("OrderStreamEventType", () => {
  it("covers exactly the runtime event values", () => {
    expect(TYPE_EXAMPLES).toEqual(Object.values(ORDER_STREAM_EVENT_NAMES));
  });
});
