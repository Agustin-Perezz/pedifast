"use client";

import { Input } from "@/components/ui/input";

import { FieldErrorText } from "../../components/field-error-text";
import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";

const NAME_FIELD_ID = "checkout-nombre";
const PHONE_FIELD_ID = "checkout-telefono";
const PHONE_COUNTRY_CODE = "+54";

export type CustomerDataCardProps = {
  readonly nombre: string;
  readonly telefono: string;
  readonly onChange: (patch: PatchCheckoutForm) => void;
  readonly nameError: string | null;
  readonly phoneError: string | null;
};

export function CustomerDataCard({
  nombre,
  telefono,
  onChange,
  nameError,
  phoneError,
}: CustomerDataCardProps) {
  return (
    <div className="mt-4 flex flex-col gap-2 rounded-xl bg-card p-3.5 shadow-sm">
      <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
        Tus datos
      </span>
      <div className="flex flex-col gap-1.5">
        <Input
          id={NAME_FIELD_ID}
          data-testid={`${NAME_FIELD_ID}-input`}
          type="text"
          aria-label="Nombre"
          aria-invalid={nameError !== null}
          placeholder="Tu nombre"
          value={nombre}
          onChange={(event) => onChange({ nombre: event.target.value })}
          className="h-11 w-full rounded-lg bg-surface-container px-3.5 text-sm text-foreground placeholder:text-outline"
        />
        <FieldErrorText message={nameError} />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex h-11 w-full items-center overflow-hidden rounded-lg bg-surface-container">
          <span
            className="flex h-full shrink-0 items-center gap-1.5 border-r border-outline px-3 text-sm font-semibold text-muted-foreground"
            aria-hidden="true"
          >
            🇦🇷 {PHONE_COUNTRY_CODE}
          </span>
          <Input
            id={PHONE_FIELD_ID}
            data-testid={`${PHONE_FIELD_ID}-input`}
            type="tel"
            aria-label="Teléfono"
            aria-invalid={phoneError !== null}
            placeholder="11 2345 6789"
            value={telefono}
            onChange={(event) => onChange({ telefono: event.target.value })}
            className="h-11 flex-1 rounded-none border-transparent bg-transparent px-3.5 text-sm text-foreground placeholder:text-outline focus-visible:ring-transparent"
          />
        </div>
        <FieldErrorText message={phoneError} />
      </div>
    </div>
  );
}
