export type TipValue = "no" | "500" | "1000" | "1500";

export const TIP_OPTIONS: readonly TipValue[] = ["no", "500", "1000", "1500"];

export const DEFAULT_TIP: TipValue = "no";

const NO_TIP_LABEL = "No";

export function tipLabel(value: TipValue): string {
  if (value === "no") {
    return NO_TIP_LABEL;
  }

  return `$${Number(value).toLocaleString("es-AR")}`;
}
