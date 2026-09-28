"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TextFieldProps = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly required?: boolean;
  readonly onChange: (value: string) => void;
};

export function TextField({
  id,
  label,
  value,
  required = false,
  onChange,
}: TextFieldProps) {
  return (
    <div className="space-y-1" data-testid={`field-${id}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        data-testid={`${id}-input`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </div>
  );
}
