import { Clock, MapPin, Search, User } from "lucide-react";

import type { Shop } from "@/domain/entities/shop.entity";

type ShopHeaderProps = {
  readonly shop: Shop;
  readonly shopName: string;
};

export function ShopHeader({ shop, shopName }: ShopHeaderProps) {
  const name = shop.displayName ?? shopName;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`;
  const city = shop.address.split(",")[1]?.trim() ?? shop.address;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-card/90 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-5 md:max-w-3xl lg:max-w-5xl">
          <div className="flex min-w-0 flex-col">
            <h1 className="font-heading truncate text-lg font-bold tracking-tight text-foreground">
              {name}
            </h1>
            <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-chart-2" />
              <span className="truncate">{city}</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2" aria-hidden="true">
            <span className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:text-primary">
              <Search className="size-5" />
            </span>
            <span className="flex size-9 items-center justify-center rounded-full bg-surface-container-high text-foreground">
              <User className="size-[18px]" />
            </span>
          </div>
        </div>
      </header>

      <div className="pt-16">
        <div className="mx-auto max-w-lg px-5 md:max-w-3xl lg:max-w-5xl">
          <div className="flex items-center justify-between gap-3 border-b border-surface-container-high pt-2 pb-3 text-xs">
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center gap-2"
            >
              <MapPin className="size-4 shrink-0 text-primary" />
              <span className="truncate text-muted-foreground">
                {shop.address}
              </span>
            </a>
            {shop.openHours && (
              <span className="flex shrink-0 items-center gap-1.5">
                <Clock className="size-4 text-outline" />
                <span className="text-muted-foreground">{shop.openHours}</span>
              </span>
            )}
          </div>

          <div className="relative py-3">
            <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-outline" />
            <input
              type="text"
              disabled
              aria-disabled="true"
              placeholder="Buscar platos, pizzas o ingredientes..."
              className="w-full rounded-xl bg-surface-container-low py-2 pr-4 pl-10 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>
    </>
  );
}
