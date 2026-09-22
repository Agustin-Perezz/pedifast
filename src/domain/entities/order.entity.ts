import { InvalidOrderError } from "./errors";
import { type OrderSchema, orderSchema } from "./order.schema";
import { OrderExternalReference } from "./order-external-reference";
import type { OrderItemSchema } from "./order-item.schema";
import { OrderStatus } from "./order-status.enum";
import { PaymentMethod } from "./payment-method.enum";
import { PaymentStatus } from "./payment-status.enum";

export type OrderProps = OrderSchema;

export type OrderItemInput = {
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly accessories?: ReadonlyArray<{
    readonly name: string;
    readonly priceDelta: number;
  }>;
};

type OrderInputRequired = Pick<
  OrderProps,
  | "shopId"
  | "externalReference"
  | "customerName"
  | "deliveryMethod"
  | "paymentMethod"
  | "paymentStatus"
  | "items"
  | "total"
>;

type OrderInputOptional = Partial<
  Pick<
    OrderProps,
    | "id"
    | "customerPhone"
    | "notes"
    | "address"
    | "deliveryCost"
    | "status"
    | "createdAt"
    | "updatedAt"
  >
>;

export type OrderInput = OrderInputRequired & OrderInputOptional;

export class Order {
  private constructor(private readonly props: OrderProps) {}

  static create(input: OrderInput): Order {
    const parsed = orderSchema.safeParse({
      id: input.id ?? 0,
      shopId: input.shopId,
      externalReference: input.externalReference,
      customerName: input.customerName,
      customerPhone: input.customerPhone ?? null,
      notes: input.notes ?? null,
      deliveryMethod: input.deliveryMethod,
      address: input.address ?? null,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentStatus,
      items: input.items,
      total: input.total,
      deliveryCost: input.deliveryCost ?? 0,
      status: input.status ?? OrderStatus.Pending,
      createdAt: input.createdAt ?? new Date().toISOString(),
      updatedAt: input.updatedAt ?? new Date().toISOString(),
    });

    if (!parsed.success) {
      throw new InvalidOrderError(
        `Invalid order: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
      );
    }

    return new Order(parsed.data);
  }

  static derivePaymentStatus(paymentMethod: PaymentMethod): PaymentStatus {
    return paymentMethod === PaymentMethod.Efectivo
      ? PaymentStatus.Approved
      : PaymentStatus.Pending;
  }

  static formatItemName(
    productName: string,
    accessoryNames: readonly string[],
  ): string {
    if (accessoryNames.length === 0) {
      return productName;
    }

    return `${productName} (${accessoryNames.join(", ")})`;
  }

  get id(): number {
    return this.props.id;
  }

  get shopId(): number {
    return this.props.shopId;
  }

  get externalReference(): string {
    return this.props.externalReference;
  }

  get customerName(): string {
    return this.props.customerName;
  }

  get customerPhone(): string | null {
    return this.props.customerPhone;
  }

  get notes(): string | null {
    return this.props.notes;
  }

  get deliveryMethod(): string {
    return this.props.deliveryMethod;
  }

  get address(): string | null {
    return this.props.address;
  }

  get paymentMethod(): PaymentMethod {
    return this.props.paymentMethod;
  }

  get paymentStatus(): PaymentStatus {
    return this.props.paymentStatus;
  }

  get items(): ReadonlyArray<OrderItemSchema> {
    return this.props.items;
  }

  get total(): number {
    return this.props.total;
  }

  get deliveryCost(): number {
    return this.props.deliveryCost;
  }

  get status(): OrderStatus {
    return this.props.status;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  getExternalReference(): OrderExternalReference {
    return OrderExternalReference.fromReference(this.props.externalReference);
  }

  withStatus(status: OrderStatus): Order {
    return new Order({ ...this.props, status });
  }

  withPaymentStatus(paymentStatus: PaymentStatus): Order {
    return new Order({ ...this.props, paymentStatus });
  }

  toObject(): OrderProps {
    return { ...this.props };
  }
}
