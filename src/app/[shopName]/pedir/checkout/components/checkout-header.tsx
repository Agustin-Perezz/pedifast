"use client";

import type { PlainShop } from "../../lib/serialize-shop";
import { BackButton, StepBadge } from "./header-parts";

export type CheckoutHeaderProps = {
  readonly shop: PlainShop;
  readonly shopName: string;
  readonly backHref: string;
};

export function CheckoutHeader({
  shop,
  shopName,
  backHref,
}: CheckoutHeaderProps) {
  const displayName = shop.displayName ?? shopName;
  const city = shop.address.split(",")[1]?.trim() ?? shop.address;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-card/90 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-5 md:max-w-3xl lg:max-w-5xl">
        <div className="flex min-w-0 items-center gap-3">
          <BackButton href={backHref} label="Volver al menú" />
          <div className="flex min-w-0 flex-col">
            <h2 className="font-heading truncate text-lg font-bold tracking-tight text-foreground">
              Confirmar pedido
            </h2>
            <span className="truncate text-[11px] text-muted-foreground">
              {displayName} • {city}
            </span>
          </div>
        </div>
        <StepBadge label="Paso 2 de 2" />
      </div>
    </header>
  );
}
