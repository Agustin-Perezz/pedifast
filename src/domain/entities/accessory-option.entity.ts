import {
  type AccessoryOptionSchema,
  accessoryOptionSchema,
} from "./accessory-option.schema";
import { InvalidOrderError } from "./errors";

export type AccessoryOptionProps = AccessoryOptionSchema;

export type AccessoryOptionInput = Omit<
  AccessoryOptionProps,
  "id" | "createdAt" | "updatedAt"
> &
  Partial<Pick<AccessoryOptionProps, "id" | "createdAt" | "updatedAt">>;

export class AccessoryOption {
  private constructor(private readonly props: AccessoryOptionProps) {}

  static create(input: AccessoryOptionInput): AccessoryOption {
    const parsed = accessoryOptionSchema.safeParse({
      id: input.id ?? 0,
      groupId: input.groupId,
      name: input.name,
      priceDelta: input.priceDelta ?? 0,
      sortOrder: input.sortOrder ?? 0,
      createdAt: input.createdAt ?? new Date().toISOString(),
      updatedAt: input.updatedAt ?? new Date().toISOString(),
    });

    if (!parsed.success) {
      throw new InvalidOrderError(
        `Invalid accessory option: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
      );
    }

    return new AccessoryOption(parsed.data);
  }

  get id(): number {
    return this.props.id;
  }

  get groupId(): number {
    return this.props.groupId;
  }

  get name(): string {
    return this.props.name;
  }

  get priceDelta(): number {
    return this.props.priceDelta;
  }

  get sortOrder(): number {
    return this.props.sortOrder;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  toObject(): AccessoryOptionProps {
    return { ...this.props };
  }
}
