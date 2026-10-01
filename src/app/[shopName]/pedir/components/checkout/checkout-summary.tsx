"use client";

import { formatPrice } from "@/lib/utils/format";

type CheckoutSummaryProps = {
  readonly itemsTotal: number;
  readonly deliveryCost: number | null;
};

export function CheckoutSummary({
  itemsTotal,
  deliveryCost,
}: CheckoutSummaryProps) {
  const total = itemsTotal + (deliveryCost ?? 0);

  return (
    <div className="space-y-1 border-t pt-3" data-testid="checkout-summary">
      <SummaryRow label="Productos" value={formatPrice(itemsTotal)} />
      {deliveryCost !== null && (
        <SummaryRow label="Envío" value={formatPrice(deliveryCost)} />
      )}
      <SummaryRow label="Total" value={formatPrice(total)} emphasized />
    </div>
  );
}

type SummaryRowProps = {
  readonly label: string;
  readonly value: string;
  readonly emphasized?: boolean;
};

function SummaryRow({ label, value, emphasized = false }: SummaryRowProps) {
  return (
    <div className="flex justify-between">
      <span className={emphasized ? "font-semibold" : "text-muted-foreground"}>
        {label}
      </span>
      <span className={emphasized ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}
