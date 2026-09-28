import {
  type AccessoryGroupSchema,
  accessoryGroupSchema,
} from "./accessory-group.schema";
import type { AccessorySelectionMode } from "./accessory-selection-mode.enum";
import { InvalidOrderError } from "./errors";

export type AccessoryGroupProps = AccessoryGroupSchema;

export type AccessoryGroupInput = Omit<
  AccessoryGroupProps,
  "id" | "createdAt" | "updatedAt"
> &
  Partial<Pick<AccessoryGroupProps, "id" | "createdAt" | "updatedAt">>;

export class AccessoryGroup {
  private constructor(private readonly props: AccessoryGroupProps) {}

  static create(input: AccessoryGroupInput): AccessoryGroup {
    const parsed = accessoryGroupSchema.safeParse({
      id: input.id ?? 0,
      shopItemId: input.shopItemId,
      name: input.name,
      selectionMode: input.selectionMode,
      isRequired: input.isRequired ?? false,
      sortOrder: input.sortOrder ?? 0,
      createdAt: input.createdAt ?? new Date().toISOString(),
      updatedAt: input.updatedAt ?? new Date().toISOString(),
    });

    if (!parsed.success) {
      throw new InvalidOrderError(
        `Invalid accessory group: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
      );
    }

    return new AccessoryGroup(parsed.data);
  }

  get id(): number {
    return this.props.id;
  }

  get shopItemId(): number {
    return this.props.shopItemId;
  }

  get name(): string {
    return this.props.name;
  }

  get selectionMode(): AccessorySelectionMode {
    return this.props.selectionMode;
  }

  get isRequired(): boolean {
    return this.props.isRequired;
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

  toObject(): AccessoryGroupProps {
    return { ...this.props };
  }
}
