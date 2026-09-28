import { InvalidOrderError } from "./errors";
import { OrderFlow } from "./order-flow.enum";
import { type ShopSchema, shopSchema } from "./shop.schema";

export type ShopProps = ShopSchema;

export type ShopInput = Omit<
  ShopProps,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "mpAccessToken"
  | "mpRefreshToken"
  | "mpTokenExpiresAt"
  | "mpUserId"
  | "mpPublicKey"
  | "connectedAt"
> &
  Partial<
    Pick<
      ShopProps,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "mpAccessToken"
      | "mpRefreshToken"
      | "mpTokenExpiresAt"
      | "mpUserId"
      | "mpPublicKey"
      | "connectedAt"
    >
  >;

export class Shop {
  private constructor(private readonly props: ShopProps) {}

  static create(input: ShopInput): Shop {
    const parsed = shopSchema.safeParse({
      id: input.id ?? 0,
      shopName: input.shopName,
      address: input.address,
      deliveryPrice: input.deliveryPrice ?? null,
      whatsappPhone: input.whatsappPhone,
      displayName: input.displayName ?? null,
      logoUrl: input.logoUrl ?? null,
      portraitUrl: input.portraitUrl ?? null,
      openHours: input.openHours ?? null,
      lat: input.lat ?? 0,
      lng: input.lng ?? 0,
      pricePerKm: input.pricePerKm ?? 0,
      orderFlow: input.orderFlow,
      dashboardPinHash: input.dashboardPinHash ?? null,
      mpAccessToken: input.mpAccessToken ?? null,
      mpRefreshToken: input.mpRefreshToken ?? null,
      mpTokenExpiresAt: input.mpTokenExpiresAt ?? null,
      mpUserId: input.mpUserId ?? null,
      mpPublicKey: input.mpPublicKey ?? null,
      connectedAt: input.connectedAt ?? null,
      createdAt: input.createdAt ?? new Date().toISOString(),
      updatedAt: input.updatedAt ?? new Date().toISOString(),
    });

    if (!parsed.success) {
      throw new InvalidOrderError(
        `Invalid shop: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
      );
    }

    return new Shop(parsed.data);
  }

  get id(): number {
    return this.props.id;
  }

  get shopName(): string {
    return this.props.shopName;
  }

  get address(): string {
    return this.props.address;
  }

  get deliveryPrice(): number | null {
    return this.props.deliveryPrice;
  }

  get whatsappPhone(): string {
    return this.props.whatsappPhone;
  }

  get displayName(): string | null {
    return this.props.displayName;
  }

  get logoUrl(): string | null {
    return this.props.logoUrl;
  }

  get portraitUrl(): string | null {
    return this.props.portraitUrl;
  }

  get openHours(): string | null {
    return this.props.openHours;
  }

  get lat(): number {
    return this.props.lat;
  }

  get lng(): number {
    return this.props.lng;
  }

  get pricePerKm(): number {
    return this.props.pricePerKm;
  }

  get orderFlow(): OrderFlow {
    return this.props.orderFlow;
  }

  get dashboardPinHash(): string | null {
    return this.props.dashboardPinHash;
  }

  get mpAccessToken(): string | null {
    return this.props.mpAccessToken;
  }

  get mpRefreshToken(): string | null {
    return this.props.mpRefreshToken;
  }

  get mpTokenExpiresAt(): string | null {
    return this.props.mpTokenExpiresAt;
  }

  get mpUserId(): string | null {
    return this.props.mpUserId;
  }

  get mpPublicKey(): string | null {
    return this.props.mpPublicKey;
  }

  get connectedAt(): string | null {
    return this.props.connectedAt;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  usesDashboardFlow(): boolean {
    return this.props.orderFlow === OrderFlow.Dashboard;
  }

  toObject(): ShopProps {
    return { ...this.props };
  }

  withMpTokens(input: {
    mpAccessToken: string;
    mpRefreshToken: string;
    mpTokenExpiresAt: string;
    mpUserId: string;
    mpPublicKey: string;
    connectedAt: string;
  }): Shop {
    return new Shop({
      ...this.props,
      ...input,
    });
  }
}
