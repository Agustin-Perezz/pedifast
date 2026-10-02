import { CirclePlus } from "lucide-react";

export function AddMoreProductsLink({
  shopName,
}: {
  readonly shopName: string;
}) {
  return (
    <a
      href={`/${shopName}/pedir`}
      className="inline-flex items-center gap-1.5 self-start py-1 text-sm font-bold text-primary hover:text-primary-container"
      data-testid="add-more-products"
      aria-label="Agregar más productos al pedido"
    >
      <CirclePlus aria-hidden="true" className="size-[18px]" />
      Agregar más productos
    </a>
  );
}
