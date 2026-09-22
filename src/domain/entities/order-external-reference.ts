import { OrderExternalReferenceFormatError } from "./errors";

export type OrderExternalReferenceParts = {
  readonly shopName: string;
  readonly timestamp: number;
};

export class OrderExternalReference {
  private constructor(
    private readonly props: {
      readonly shopName: string;
      readonly timestamp: number;
    },
  ) {}

  static create(shopName: string, timestamp: number): OrderExternalReference {
    if (shopName.length === 0) {
      throw new OrderExternalReferenceFormatError("");
    }

    if (Number.isNaN(timestamp) || timestamp <= 0) {
      throw new OrderExternalReferenceFormatError(String(timestamp));
    }

    return new OrderExternalReference({ shopName, timestamp });
  }

  static fromReference(reference: string): OrderExternalReference {
    const lastDashIndex = reference.lastIndexOf("-");

    if (lastDashIndex === -1 || lastDashIndex === 0) {
      throw new OrderExternalReferenceFormatError(reference);
    }

    const shopName = reference.slice(0, lastDashIndex);
    const timestampString = reference.slice(lastDashIndex + 1);
    const timestamp = Number(timestampString);

    if (shopName.length === 0 || !/^[1-9]\d*$/.test(timestampString)) {
      throw new OrderExternalReferenceFormatError(reference);
    }

    return OrderExternalReference.create(shopName, timestamp);
  }

  static generate(shopName: string): OrderExternalReference {
    return OrderExternalReference.create(shopName, Date.now());
  }

  get shopName(): string {
    return this.props.shopName;
  }

  get timestamp(): number {
    return this.props.timestamp;
  }

  toReference(): string {
    return `${this.props.shopName}-${this.props.timestamp}`;
  }

  toParts(): OrderExternalReferenceParts {
    return { ...this.props };
  }
}
