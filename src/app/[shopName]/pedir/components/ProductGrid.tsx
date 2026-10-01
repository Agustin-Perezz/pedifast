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
        <section id={key} key={key} className="mb-8 px-4 pt-2">
          <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {label}
            </h2>
          </div>
          <div className="flex flex-col gap-3 pb-2">
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
