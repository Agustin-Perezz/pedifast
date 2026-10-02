import { Button } from "@/components/ui/button";

export function AddressSummaryActions({ label }: { readonly label: string }) {
  return (
    <Button
      type="button"
      variant="ghost"
      disabled
      className="shrink-0 cursor-not-allowed text-xs font-bold text-primary opacity-50"
    >
      {label}
    </Button>
  );
}
