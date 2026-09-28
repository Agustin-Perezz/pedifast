import type { PendingWhatsappOrder } from "./whatsapp";

const ORDER_KEY_PREFIX = "order-";

type StorageLike = {
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
};

export function buildOrderStorageKey(externalReference: string): string {
  return `${ORDER_KEY_PREFIX}${externalReference}`;
}

export function persistPendingWhatsappOrder(
  storage: StorageLike,
  externalReference: string,
  order: PendingWhatsappOrder,
): void {
  storage.setItem(
    buildOrderStorageKey(externalReference),
    JSON.stringify(order),
  );
}

export function readPendingWhatsappOrder(
  storage: StorageLike,
  externalReference: string,
): PendingWhatsappOrder | null {
  const raw = storage.getItem(buildOrderStorageKey(externalReference));

  if (raw === null) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingWhatsappOrder;
  } catch {
    return null;
  }
}

export function removePendingWhatsappOrder(
  storage: StorageLike,
  externalReference: string,
): void {
  storage.removeItem(buildOrderStorageKey(externalReference));
}
