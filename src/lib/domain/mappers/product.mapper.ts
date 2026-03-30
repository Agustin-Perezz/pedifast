import {
  ShopItemCategory,
  type AccessoryGroup,
  type AccessoryOption,
  type AccessorySelectionMode,
  type Product
} from '$domain/models/product';
import type { RawAccessoryGroup } from '$domain/types/accessory-group.entity';

interface ShopItemEntity {
  id: number;
  name: string;
  price: number;
  category: string;
  images: string[];
  description: string | null;
}

export class ProductMapper {
  static fromEntityToProduct(
    entity: ShopItemEntity,
    accessoryGroups?: AccessoryGroup[]
  ): Product {
    return {
      id: String(entity.id),
      name: entity.name,
      price: Number(entity.price),
      images: entity.images,
      category: entity.category as ShopItemCategory,
      description: entity.description ?? undefined,
      accessoryGroups
    } satisfies Product;
  }

  static fromEntitiesToProducts(
    entities: ShopItemEntity[],
    accessoryMap?: Map<number, AccessoryGroup[]>
  ): Product[] {
    return [...entities]
      .sort((a, b) => a.id - b.id)
      .map((entity) =>
        ProductMapper.fromEntityToProduct(entity, accessoryMap?.get(entity.id))
      );
  }

  static fromEntitiesToAccessoryGroups(
    raw: RawAccessoryGroup[] | null
  ): AccessoryGroup[] | undefined {
    if (!raw || raw.length === 0) {
      return undefined;
    }
    return [...raw]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(
        (g) =>
          ({
            id: g.id,
            name: g.name,
            selectionMode: g.selection_mode as AccessorySelectionMode,
            isRequired: g.is_required,
            options: [...g.accessory_options]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map(
                (o) =>
                  ({
                    id: o.id,
                    name: o.name,
                    priceDelta: Number(o.price_delta)
                  }) satisfies AccessoryOption
              )
          }) satisfies AccessoryGroup
      );
  }
}
