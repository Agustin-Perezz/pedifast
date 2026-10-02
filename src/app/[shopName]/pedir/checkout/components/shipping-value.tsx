import { formatPrice } from "@/lib/utils/format";

type ShippingValueProps = {
  readonly deliveryCost: number | null;
};

export function ShippingValue({ deliveryCost }: ShippingValueProps) {
  if (deliveryCost === null) {
    return <span>Calculando…</span>;
  }

  if (deliveryCost === 0) {
    return (
      <span className="rounded-full bg-secondary-container/50 px-2 py-0.5 text-[11px] font-bold text-on-secondary-container">
        Gratis
      </span>
    );
  }

  return (
    <span className="font-medium text-foreground">
      {formatPrice(deliveryCost)}
    </span>
  );
}
