import { InvalidOrderError } from "./errors";
import { type ShopItemSchema, shopItemSchema } from "./shop-item.schema";
import type { ShopItemCategory } from "./shop-item-category.enum";

export type ShopItemProps = ShopItemSchema;

export type ShopItemInput = Omit<
  ShopItemProps,
  "id" | "createdAt" | "updatedAt" | "images"
> &
  Partial<Pick<ShopItemProps, "id" | "createdAt" | "updatedAt" | "images">>;

export class ShopItem {
  private constructor(private readonly props: ShopItemProps) {}

  static create(input: ShopItemInput): ShopItem {
    const parsed = shopItemSchema.safeParse({
      id: input.id ?? 0,
      shopId: input.shopId,
      name: input.name,
      price: input.price,
      category: input.category,
      images: input.images ?? [],
      description: input.description ?? null,
      accessoryGroups: input.accessoryGroups,
      createdAt: input.createdAt ?? new Date().toISOString(),
      updatedAt: input.updatedAt ?? new Date().toISOString(),
    });

    if (!parsed.success) {
      throw new InvalidOrderError(
        `Invalid shop item: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
      );
    }

    return new ShopItem(parsed.data);
  }

  get id(): number {
    return this.props.id;
  }

  get shopId(): number {
    return this.props.shopId;
  }

  get name(): string {
    return this.props.name;
  }

  get price(): number {
    return this.props.price;
  }

  get category(): ShopItemCategory {
    return this.props.category;
  }

  get images(): readonly string[] {
    return this.props.images;
  }

  get description(): string | null {
    return this.props.description;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  toObject(): ShopItemProps {
    return { ...this.props };
  }
}
