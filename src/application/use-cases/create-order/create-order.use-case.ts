import { ShopFlowMismatchError } from "@/domain/entities/errors";
import { Order } from "@/domain/entities/order.entity";
import { OrderExternalReference } from "@/domain/entities/order-external-reference";
import { OrderFlow } from "@/domain/entities/order-flow.enum";
import type { CreateOrderRepository } from "./create-order.repository.interface";
import type { CreateOrderInput } from "./create-order.request.dto";
import type { CreateOrderResponseDto } from "./create-order.response.dto";

export class CreateOrderUseCase {
  constructor(private readonly repository: CreateOrderRepository) {}

  async execute(input: CreateOrderInput): Promise<CreateOrderResponseDto> {
    if (input.orderFlow !== OrderFlow.Dashboard) {
      throw new ShopFlowMismatchError(input.shopName);
    }

    const externalReference = OrderExternalReference.generate(
      input.shopName,
    ).toReference();

    const order = Order.create({
      shopId: input.shopId,
      externalReference,
      customerName: input.payload.customerName,
      customerPhone: input.payload.customerPhone,
      notes: input.payload.notes,
      deliveryMethod: input.payload.deliveryMethod,
      address: input.payload.address,
      paymentMethod: input.payload.paymentMethod,
      paymentStatus: Order.derivePaymentStatus(input.payload.paymentMethod),
      items: input.payload.items,
      total: computeTotal(input.payload.items, input.payload.deliveryCost),
      deliveryCost: input.payload.deliveryCost,
    });

    const saved = await this.repository.create(order);

    return { id: saved.id, externalReference: saved.externalReference };
  }
}

function computeTotal(
  items: readonly { unitPrice: number; quantity: number }[],
  deliveryCost: number,
): number {
  const itemsTotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  return itemsTotal + deliveryCost;
}
