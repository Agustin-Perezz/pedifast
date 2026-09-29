export const AR_LOCALE = "es-AR";

export function formatPrice(price: number): string {
  return `$${price.toLocaleString(AR_LOCALE)}`;
}
