import type { Shop } from "@/domain/entities/shop.entity";
import { ShopBanner } from "./ShopBanner";
import { ShopInfo } from "./ShopInfo";

type ShopHeaderProps = {
  readonly shop: Shop;
  readonly shopName: string;
};

export function ShopHeader({ shop, shopName }: ShopHeaderProps) {
  const name = shop.displayName ?? shopName;

  return (
    <header className="relative">
      <ShopBanner
        name={name}
        portraitUrl={shop.portraitUrl}
        logoUrl={shop.logoUrl}
      />
      <ShopInfo name={name} address={shop.address} openHours={shop.openHours} />
    </header>
  );
}
