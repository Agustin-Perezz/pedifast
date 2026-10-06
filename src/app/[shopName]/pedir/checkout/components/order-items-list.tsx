import type { CartItem } from "../../lib/cart-reducer";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../../lib/serialize-catalog";
import type { CartItemExtras } from "../components/item-extras-map";
import { AddMoreProductsLink } from "./add-more-products-link";
import { ItemAccessoryGroups } from "./item-accessory-groups";
import { OrderItemRow } from "./order-item-row";

export type OrderItemsListProps = {
  readonly items: readonly CartItem[];
  readonly itemExtras: ReadonlyMap<number, CartItemExtras>;
  readonly accessoryGroupsByItemId: ReadonlyMap<
    number,
    readonly PlainAccessoryGroup[]
  >;
  readonly showMissingAccessoryHints: boolean;
  readonly onSelectAccessories: (
    itemId: number,
    group: PlainAccessoryGroup,
    selectedOptions: readonly PlainAccessoryOption[],
  ) => void;
  readonly shopName: string;
  readonly onAddItem: (item: CartItem) => void;
  readonly onRemoveItem: (item: CartItem) => void;
};

export function OrderItemsList({
  items,
  itemExtras,
  accessoryGroupsByItemId,
  showMissingAccessoryHints,
  onSelectAccessories,
  shopName,
  onAddItem,
  onRemoveItem,
}: OrderItemsListProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-xl bg-card p-3 shadow-sm">
        {items.map((item, index) => (
          <div key={item.product.id}>
            {index > 0 && <div className="h-px w-full bg-surface-container" />}
            <OrderItemRow
              item={item}
              extras={itemExtras.get(item.product.id)}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
            />
            <ItemAccessoryGroups
              item={item}
              groups={accessoryGroupsByItemId.get(item.product.id) ?? []}
              showMissingHints={showMissingAccessoryHints}
              onSelectAccessories={onSelectAccessories}
            />
          </div>
        ))}
      </div>
      <AddMoreProductsLink shopName={shopName} />
    </div>
  );
}
