import { formatPrice } from "@/lib/utils/format";

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
    <article className="flex gap-3 rounded-xl bg-card p-4 shadow-sm">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <a
          href={`/${shopName}/pedir/${product.id}`}
          className="truncate font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          {product.name}
        </a>
        {product.description && (
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </p>
          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.price}
            label="Agregar"
          />
        </div>
      </div>
      <a
        href={`/${shopName}/pedir/${product.id}`}
        tabIndex={-1}
        className="size-24 shrink-0 self-center"
      >
        <img
          src={product.images[0] ?? ""}
          alt=""
          className="size-24 rounded-xl object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
        />
      </a>
    </article>
  );
}
