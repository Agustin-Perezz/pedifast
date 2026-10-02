"use client";

import { Input } from "@/components/ui/input";

import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";

const NAME_FIELD_ID = "checkout-nombre";
const PHONE_FIELD_ID = "checkout-telefono";

export type CustomerDataCardProps = {
  readonly nombre: string;
  readonly telefono: string;
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function CustomerDataCard({
  nombre,
  telefono,
  onChange,
}: CustomerDataCardProps) {
  return (
    <div className="mt-4 flex flex-col gap-2 rounded-xl bg-card p-3.5 shadow-sm">
      <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
        Tus datos
      </span>
      <Input
        id={NAME_FIELD_ID}
        data-testid={`${NAME_FIELD_ID}-input`}
        type="text"
        aria-label="Nombre"
        placeholder="Tu nombre"
        value={nombre}
        onChange={(event) => onChange({ nombre: event.target.value })}
        className="h-11 w-full rounded-lg bg-surface-container px-3.5 text-sm text-foreground placeholder:text-outline"
      />
      <Input
        id={PHONE_FIELD_ID}
        data-testid={`${PHONE_FIELD_ID}-input`}
        type="tel"
        aria-label="Teléfono"
        placeholder="11 2345 6789"
        value={telefono}
        onChange={(event) => onChange({ telefono: event.target.value })}
        className="h-11 w-full rounded-lg bg-surface-container px-3.5 text-sm text-foreground placeholder:text-outline"
      />
    </div>
  );
}
