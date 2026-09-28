import { describe, expect, it } from "vitest";

import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";

import {
  buildOrderStorageKey,
  persistPendingWhatsappOrder,
  readPendingWhatsappOrder,
  removePendingWhatsappOrder,
} from "./order-storage";
import type { PendingWhatsappOrder } from "./whatsapp";

class MemoryStorage {
  private readonly map = new Map<string, string>();

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }

  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }
}

const ORDER: PendingWhatsappOrder = {
  shopName: "pizzeria-luca",
  whatsappPhone: "+5491234567890",
  nombre: "Agustin",
  deliveryMethod: DeliveryMethod.Pickup,
  address: null,
  notas: null,
  paymentMethod: PaymentMethod.Efectivo,
  items: [{ name: "Pizza", quantity: 1, unitPrice: 2000 }],
  total: 2000,
};

const EXTERNAL_REFERENCE = "pizzeria-luca-1700000000000";

describe("order storage", () => {
  it("builds the prefixed storage key", () => {
    expect(buildOrderStorageKey(EXTERNAL_REFERENCE)).toBe(
      `order-${EXTERNAL_REFERENCE}`,
    );
  });

  it("persists and reads back a pending order", () => {
    const storage = new MemoryStorage();

    persistPendingWhatsappOrder(storage, EXTERNAL_REFERENCE, ORDER);

    expect(readPendingWhatsappOrder(storage, EXTERNAL_REFERENCE)).toEqual(
      ORDER,
    );
  });

  it("returns null for a missing order", () => {
    const storage = new MemoryStorage();

    expect(readPendingWhatsappOrder(storage, EXTERNAL_REFERENCE)).toBeNull();
  });

  it("returns null for corrupted payloads", () => {
    const storage = new MemoryStorage();

    storage.setItem(buildOrderStorageKey(EXTERNAL_REFERENCE), "{not json");

    expect(readPendingWhatsappOrder(storage, EXTERNAL_REFERENCE)).toBeNull();
  });

  it("removes a persisted order", () => {
    const storage = new MemoryStorage();

    persistPendingWhatsappOrder(storage, EXTERNAL_REFERENCE, ORDER);
    removePendingWhatsappOrder(storage, EXTERNAL_REFERENCE);

    expect(readPendingWhatsappOrder(storage, EXTERNAL_REFERENCE)).toBeNull();
  });
});
