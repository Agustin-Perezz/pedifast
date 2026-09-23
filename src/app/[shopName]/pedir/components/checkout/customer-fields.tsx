"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { TextField } from "./text-field";

type CustomerFieldPatch = {
  readonly nombre?: string;
  readonly telefono?: string;
  readonly notas?: string;
};

type CustomerFieldsProps = {
  readonly nombre: string;
  readonly telefono: string;
  readonly notas: string;
  readonly onChange: (patch: CustomerFieldPatch) => void;
};

const NOTAS_FIELD_ID = "checkout-notas";

export function CustomerFields({
  nombre,
  telefono,
  notas,
  onChange,
}: CustomerFieldsProps) {
  return (
    <div className="space-y-3">
      <TextField
        id="checkout-nombre"
        label="Nombre"
        value={nombre}
        required
        onChange={(nombreValue) => onChange({ nombre: nombreValue })}
      />
      <TextField
        id="checkout-telefono"
        label="Teléfono"
        value={telefono}
        onChange={(telefonoValue) => onChange({ telefono: telefonoValue })}
      />
      <div className="space-y-1" data-testid={NOTAS_FIELD_ID}>
        <Label htmlFor={NOTAS_FIELD_ID}>Notas</Label>
        <Textarea
          id={NOTAS_FIELD_ID}
          data-testid={`${NOTAS_FIELD_ID}-input`}
          value={notas}
          onChange={(event) => onChange({ notas: event.target.value })}
        />
      </div>
    </div>
  );
}
