import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function VerPedidoButton({ onClick }: { readonly onClick: () => void }) {
  return (
    <Button
      type="button"
      data-testid="confirm-order-button"
      className="rounded-lg bg-card px-4 py-2 text-sm font-bold text-inverse-surface hover:bg-card/90 active:scale-95"
      onClick={onClick}
    >
      Ver pedido
      <ArrowRight className="size-4" />
    </Button>
  );
}
