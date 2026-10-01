"use client";

import { formatPrice } from "@/lib/utils/format";

import { AddToCartButton } from "../../components/AddToCartButton";
import { CATEGORY_LABELS } from "../../lib/category-labels";

type ProductInfoCardProps = {
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly description: string | null;
  readonly price: number;
};

export function ProductInfoCard({
  id,
  name,
  category,
  description,
  price,
}: ProductInfoCardProps) {
  const categoryLabel =
    CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category;

  return (
    <div className="z-10 -mt-2 flex-1 rounded-t-3xl bg-card px-6 pt-7 pb-10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] shadow-outline-variant md:-mt-0 md:rounded-none md:px-0 md:shadow-none">
      <h1 className="text-2xl font-bold text-foreground md:text-3xl">{name}</h1>
      <p className="mt-0.5 text-sm text-muted-foreground italic">
        {categoryLabel}
      </p>

      {description && (
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <span className="text-2xl font-bold text-foreground md:text-3xl">
          {formatPrice(price)}
        </span>
        <AddToCartButton
          id={id}
          name={name}
          price={price}
          label="Agregar al pedido"
        />
      </div>
    </div>
  );
}
