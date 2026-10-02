"use client";

export type CostRowProps = {
  readonly label: string;
  readonly value: string;
};

export function CostRow({ label, value }: CostRowProps) {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
