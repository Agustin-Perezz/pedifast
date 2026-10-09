export type ReceiptRowProps = {
  readonly label: string;
  readonly value: string;
  readonly mono?: boolean;
};

export function ReceiptRow({ label, value, mono }: ReceiptRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-500">{label}</span>
      <span
        className={
          mono ? "font-mono text-xs text-zinc-950" : "text-xs text-zinc-950"
        }
      >
        {value}
      </span>
    </div>
  );
}
