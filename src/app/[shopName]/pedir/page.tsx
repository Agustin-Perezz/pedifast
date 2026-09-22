import { notFound } from "next/navigation";
import { CartBottomBar } from "./components/CartBottomBar";
import { CategoryNav } from "./components/CategoryNav";
import { CheckoutOverlay } from "./components/CheckoutOverlay";
import { ProductGrid } from "./components/ProductGrid";
import { ShopHeader } from "./components/ShopHeader";
import { CheckoutOpenProvider } from "./hooks/useCheckoutOpen";
import {
  CATEGORY_EMOJIS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from "./lib/category-labels";
import { serializeCategoryGroups } from "./lib/serialize-catalog";
import { serializeShop } from "./lib/serialize-shop";
import { getShopCatalog } from "./queries";

export const revalidate = 30;

type ShopCatalogPageParams = {
  readonly shopName: string;
};

type ShopCatalogPageProps = {
  readonly params: Promise<ShopCatalogPageParams>;
};

export default async function ShopCatalogPage({
  params,
}: ShopCatalogPageProps) {
  const { shopName } = await params;
  const { catalog } = await getShopCatalog(shopName);

  if (!catalog) {
    notFound();
  }

  const groups = serializeCategoryGroups({
    items: catalog.items,
    categoryLabels: CATEGORY_LABELS,
    categoryEmojis: CATEGORY_EMOJIS,
    categoryOrder: CATEGORY_ORDER,
  });

  return (
    <CheckoutOpenProvider>
      <main className="min-h-screen bg-[#F5F5F5]">
        <ShopHeader shop={catalog.shop} shopName={shopName} />
        <CategoryNav categories={groups} />
        <ProductGrid groups={groups} shopName={shopName} />
      </main>
      <CartBottomBar />
      <CheckoutOverlay shop={serializeShop(catalog.shop, shopName)} />
    </CheckoutOpenProvider>
  );
}
