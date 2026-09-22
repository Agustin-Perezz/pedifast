import { describe, expect, it } from "vitest";
import { OrderExternalReferenceFormatError } from "./errors";
import { OrderExternalReference } from "./order-external-reference";

describe("OrderExternalReference", () => {
  it("formats shop name and timestamp", () => {
    const reference = OrderExternalReference.create(
      "pizzeria-luca",
      1700000000000,
    );

    expect(reference.toReference()).toBe("pizzeria-luca-1700000000000");
  });

  it("parses the canonical reference into parts", () => {
    const reference = OrderExternalReference.fromReference(
      "pizzeria-luca-1700000000000",
    );

    expect(reference.shopName).toBe("pizzeria-luca");
    expect(reference.timestamp).toBe(1700000000000);
    expect(reference.toParts()).toEqual({
      shopName: "pizzeria-luca",
      timestamp: 1700000000000,
    });
  });

  it("rejects a reference without a dash", () => {
    expect(() => OrderExternalReference.fromReference("invalid")).toThrow(
      OrderExternalReferenceFormatError,
    );
  });

  it("rejects a reference with an empty shop name", () => {
    expect(() =>
      OrderExternalReference.fromReference("-1700000000000"),
    ).toThrow(OrderExternalReferenceFormatError);
  });

  it("rejects a reference with a non-numeric timestamp", () => {
    expect(() =>
      OrderExternalReference.fromReference("pizzeria-luca-now"),
    ).toThrow(OrderExternalReferenceFormatError);
  });

  it("rejects a reference with a zero timestamp", () => {
    expect(() =>
      OrderExternalReference.fromReference("pizzeria-luca-0"),
    ).toThrow(OrderExternalReferenceFormatError);
  });

  it("round-trips through toReference and fromReference", () => {
    const original = OrderExternalReference.create(
      "pizzeria-luca",
      1700000000000,
    );
    const restored = OrderExternalReference.fromReference(
      original.toReference(),
    );

    expect(restored.shopName).toBe(original.shopName);
    expect(restored.timestamp).toBe(original.timestamp);
  });

  it("parses a shop name that itself contains dashes", () => {
    const reference = OrderExternalReference.fromReference(
      "mi-tienda-online-1700000000000",
    );

    expect(reference.shopName).toBe("mi-tienda-online");
    expect(reference.timestamp).toBe(1700000000000);
  });
});
