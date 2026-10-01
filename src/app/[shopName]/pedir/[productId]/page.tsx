import { notFound } from "next/navigation";

import { getShopCatalog } from "../queries";
import { ProductImageCarousel } from "./components/ProductImageCarousel";
import { ProductInfoCard } from "./components/ProductInfoCard";
import { getShopItemDetail } from "./queries";

export const revalidate = 30;

type ProductDetailPageParams = {
  readonly shopName: string;
  readonly productId: string;
};

type ProductDetailPageProps = {
  readonly params: Promise<ProductDetailPageParams>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { shopName, productId } = await params;
  const productIdNumber = Number(productId);

  if (Number.isNaN(productIdNumber)) {
    notFound();
  }

  const [{ catalog }, { shopItem }] = await Promise.all([
    getShopCatalog(shopName),
    getShopItemDetail(productIdNumber),
  ]);

  if (!catalog || !shopItem) {
    notFound();
  }

  const belongsToShop = shopItem.item.shopId === catalog.shop.id;

  if (!belongsToShop) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="px-5 pt-5 pb-2 md:mx-auto md:w-full md:max-w-5xl">
        <a
          href={`/${shopName}/pedir`}
          className="inline-flex"
          data-testid="product-back-link"
        >
          <span aria-hidden>←</span>
          <span className="sr-only">Back to menu</span>
        </a>
      </div>

      <div className="flex flex-col md:mx-auto md:w-full md:max-w-5xl md:flex-row md:gap-12 md:px-8 md:py-8">
        <ProductImageCarousel
          images={shopItem.item.images}
          productName={shopItem.item.name}
        />
        <ProductInfoCard
          id={shopItem.item.id}
          name={shopItem.item.name}
          category={shopItem.item.category}
          description={shopItem.item.description}
          price={shopItem.item.price}
        />
      </div>
    </main>
  );
}
