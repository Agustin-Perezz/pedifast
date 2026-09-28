import { ShopItem } from "@/domain/entities/shop-item.entity";
import type { ShopItemCategory } from "@/domain/entities/shop-item-category.enum";
import type { ShopItemInsert, ShopItemRow } from "../entities/shop-item.entity";

export const shopItemMapper = {
  toDomain(row: ShopItemRow): ShopItem {
    return ShopItem.create({
      id: row.id,
      shopId: row.shop_id,
      name: row.name,
      price: row.price,
      category: row.category as ShopItemCategory,
      images: row.images,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  },

  toPersistence(item: ShopItem): ShopItemInsert {
    const props = item.toObject();
    return {
      shop_id: props.shopId,
      name: props.name,
      price: props.price,
      category: props.category,
      images: [...props.images],
      description: props.description,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
    };
  },
};
