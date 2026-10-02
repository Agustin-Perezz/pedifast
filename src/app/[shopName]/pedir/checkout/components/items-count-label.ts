const SINGULAR = "producto";
const PLURAL = "productos";

export function itemsCountLabel(totalItems: number): string {
  if (totalItems === 1) {
    return `1 ${SINGULAR}`;
  }

  return `${totalItems} ${PLURAL}`;
}
