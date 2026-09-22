import type { PlainShopItem } from "../lib/serialize-catalog";

import { AddToCartButton } from "./AddToCartButton";

type ProductCardProps = {
  readonly product: PlainShopItem;
  readonly shopName: string;
  readonly priority?: boolean;
};

export function ProductCard({
  product,
  shopName,
  priority = false,
}: ProductCardProps) {
  return (
    <div className="flex w-64 shrink-0 flex-col overflow-hidden rounded-2xl bg-white md:w-full">
      <a href={`/${shopName}/pedir/${product.id}`} tabIndex={-1}>
        <img
          src={product.images[0] ?? ""}
          alt={product.name}
          className="aspect-[4/3] w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
        />
      </a>
      <div className="flex flex-col gap-2 p-3">
        <a
          href={`/${shopName}/pedir/${product.id}`}
          className="line-clamp-2 text-sm leading-snug font-semibold text-zinc-900"
        >
          {product.name}
        </a>
        {product.description && (
          <p className="line-clamp-2 text-xs leading-snug text-zinc-400">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-zinc-900">
            {formatPrice(product.price)}
          </p>
          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.price}
            label="Add"
          />
        </div>
      </div>
    </div>
  );
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}
