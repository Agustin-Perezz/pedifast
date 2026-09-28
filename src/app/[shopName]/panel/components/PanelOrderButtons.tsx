import { Check, Printer, X } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

import { Button } from "@/components/ui/button";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ConfirmButton(props: ActionButtonProps) {
  return (
    <Button
      {...props}
      className="h-10 flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
    >
      <Check className="h-4 w-4" />
      Confirmar
    </Button>
  );
}

export function RejectButton(props: ActionButtonProps) {
  return (
    <Button
      {...props}
      className="h-10 flex-1 gap-2 bg-red-600 hover:bg-red-700"
    >
      <X className="h-4 w-4" />
      Rechazar
    </Button>
  );
}

export function PrintButton(props: ActionButtonProps) {
  return (
    <Button {...props} className="h-10 w-full gap-2" variant="outline">
      <Printer className="h-4 w-4" />
      Imprimir
    </Button>
  );
}
