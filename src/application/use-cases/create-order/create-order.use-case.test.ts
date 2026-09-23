import { describe, expect, it } from "vitest";

import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { ShopFlowMismatchError } from "@/domain/entities/errors";
import { Order } from "@/domain/entities/order.entity";
import { OrderFlow } from "@/domain/entities/order-flow.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";
import type { CreateOrderRepository } from "./create-order.repository.interface";
import {
  type CreateOrderInput,
  createOrderRequestDto,
} from "./create-order.request.dto";
import { CreateOrderUseCase } from "./create-order.use-case";

const BASE_PAYLOAD = {
  shopName: "pizzeria-luca",
  customerName: "Agustin",
  customerPhone: "+5491234567890",
  notes: null,
  deliveryMethod: DeliveryMethod.Pickup,
  address: null,
  paymentMethod: PaymentMethod.Efectivo,
  items: [
    {
      name: "Pizza Margherita (Mozzarella extra)",
      quantity: 2,
      unitPrice: 1000,
      accessories: [{ name: "Mozzarella extra", priceDelta: 0 }],
    },
  ],
  deliveryCost: 0,
};

function buildInput(
  overrides: Partial<CreateOrderInput> = {},
): CreateOrderInput {
  const payload = createOrderRequestDto.parse(BASE_PAYLOAD);

  return {
    shopName: BASE_PAYLOAD.shopName,
    orderFlow: OrderFlow.Dashboard,
    shopId: 1,
    payload,
    ...overrides,
  };
}

function buildRepository() {
  const created: unknown[] = [];

  const repository: CreateOrderRepository = {
    async create(order) {
      created.push(order);
      return order;
    },
  };

  return { repository, created };
}

describe("CreateOrderUseCase", () => {
  it("persists a dashboard order and returns id with external reference", async () => {
    const { repository, created } = buildRepository();
    const useCase = new CreateOrderUseCase(repository);

    const result = await useCase.execute(buildInput());

    expect(created).toHaveLength(1);
    expect(result.externalReference).toMatch(/^pizzeria-luca-\d+$/);
    expect(result.id).toBe((created[0] as Order).id);
  });

  it("rejects orders for shops that do not use the dashboard flow", async () => {
    const { repository } = buildRepository();
    const useCase = new CreateOrderUseCase(repository);

    await expect(
      useCase.execute(buildInput({ orderFlow: OrderFlow.Whatsapp })),
    ).rejects.toThrow(ShopFlowMismatchError);
  });

  it("adds delivery cost to the total for delivery orders", async () => {
    const { repository, created } = buildRepository();
    const useCase = new CreateOrderUseCase(repository);

    await useCase.execute(
      buildInput({
        payload: createOrderRequestDto.parse({
          ...BASE_PAYLOAD,
          deliveryMethod: DeliveryMethod.Delivery,
          address: "Av. San Martin 123",
          items: [
            { name: "Pizza", quantity: 1, unitPrice: 2000, accessories: [] },
          ],
          deliveryCost: 450,
        }),
      }),
    );

    expect((created[0] as Order).total).toBe(2450);
    expect((created[0] as Order).deliveryCost).toBe(450);
  });

  it("charges no delivery cost for pickup orders", async () => {
    const { repository, created } = buildRepository();
    const useCase = new CreateOrderUseCase(repository);

    await useCase.execute(
      buildInput({
        payload: createOrderRequestDto.parse({
          ...BASE_PAYLOAD,
          items: [
            { name: "Pizza", quantity: 1, unitPrice: 2000, accessories: [] },
          ],
          deliveryCost: 0,
        }),
      }),
    );

    expect((created[0] as Order).total).toBe(2000);
    expect((created[0] as Order).deliveryCost).toBe(0);
  });

  it("derives payment status from the payment method", async () => {
    const { repository, created } = buildRepository();
    const useCase = new CreateOrderUseCase(repository);

    await useCase.execute(
      buildInput({
        payload: createOrderRequestDto.parse({
          ...BASE_PAYLOAD,
          paymentMethod: PaymentMethod.Efectivo,
        }),
      }),
    );

    expect((created[0] as Order).paymentStatus).toBe("approved");

    await useCase.execute(
      buildInput({
        payload: createOrderRequestDto.parse({
          ...BASE_PAYLOAD,
          paymentMethod: PaymentMethod.MercadoPago,
        }),
      }),
    );

    expect((created[1] as Order).paymentStatus).toBe("pending");
  });

  it("requires an address for delivery orders", () => {
    const result = createOrderRequestDto.safeParse({
      ...BASE_PAYLOAD,
      deliveryMethod: DeliveryMethod.Delivery,
      address: null,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty customer name", () => {
    const result = createOrderRequestDto.safeParse({
      ...BASE_PAYLOAD,
      customerName: "",
    });

    expect(result.success).toBe(false);
  });

  it("serializes item names including accessories", async () => {
    const { repository, created } = buildRepository();
    const useCase = new CreateOrderUseCase(repository);

    await useCase.execute(buildInput());

    const order = created[0] as Order;
    expect(order.items[0]?.name).toBe("Pizza Margherita (Mozzarella extra)");
    expect(Order.formatItemName("Pizza", ["A", "B"])).toBe("Pizza (A, B)");
  });
});
