"use client";

import { CookingPot } from "lucide-react";

import { Input } from "@/components/ui/input";

import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";

const KITCHEN_NOTES_FIELD_ID = "kitchen-notes";

export type KitchenNotesCardProps = {
  readonly value: string;
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function KitchenNotesCard({ value, onChange }: KitchenNotesCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-card p-3.5 shadow-sm">
      <label
        htmlFor={KITCHEN_NOTES_FIELD_ID}
        className="flex items-center gap-1.5 text-xs font-bold text-foreground"
      >
        <CookingPot aria-hidden="true" className="size-4 text-outline" />
        Aclaraciones para la cocina (opcional)
      </label>
      <Input
        id={KITCHEN_NOTES_FIELD_ID}
        type="text"
        value={value}
        placeholder="Ej: Masa bien tostada, orégano aparte..."
        onChange={(event) => onChange({ notas: event.target.value })}
        className="h-11 w-full rounded-lg bg-surface-container px-3.5 text-sm text-foreground placeholder:text-outline"
      />
    </div>
  );
}
