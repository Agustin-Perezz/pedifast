import type { PlainCategoryGroup } from "../lib/serialize-catalog";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  readonly groups: readonly PlainCategoryGroup[];
  readonly shopName: string;
};

export function ProductGrid({ groups, shopName }: ProductGridProps) {
  return (
    <div
      className="mx-auto max-w-lg pb-28 md:max-w-3xl lg:max-w-5xl"
      data-shop-catalog
    >
      {groups.map(({ key, label, products }, categoryIndex) => (
        <section id={key} key={key} className="mb-8 pt-2">
          <h2 className="mb-3 px-4 text-lg font-semibold text-zinc-700">
            {label}
          </h2>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2 md:grid md:grid-cols-3 md:overflow-x-visible lg:grid-cols-4">
            {products.map((product, productIndex) => (
              <ProductCard
                key={product.id}
                product={product}
                shopName={shopName}
                priority={categoryIndex === 0 && productIndex === 0}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
