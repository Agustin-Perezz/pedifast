import { notFound } from "next/navigation";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "../lib/category-labels";
import { serializeCategoryGroups } from "../lib/serialize-catalog";
import { serializeShop } from "../lib/serialize-shop";
import { getShopCatalog } from "../queries";
import { CheckoutScreen } from "./components/checkout-screen";

export const revalidate = 30;

type CheckoutPageParams = {
  readonly shopName: string;
};

type CheckoutPageProps = {
  readonly params: Promise<CheckoutPageParams>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { shopName } = await params;
  const { catalog } = await getShopCatalog(shopName);

  if (!catalog) {
    notFound();
  }

  const groups = serializeCategoryGroups({
    items: catalog.items,
    categoryLabels: CATEGORY_LABELS,
    categoryOrder: CATEGORY_ORDER,
  });

  return (
    <CheckoutScreen
      shop={serializeShop(catalog.shop, shopName)}
      shopName={shopName}
      catalogItems={groups.flatMap((group) => group.products)}
    />
  );
}
