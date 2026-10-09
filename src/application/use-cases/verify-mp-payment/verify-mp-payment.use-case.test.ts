import { describe, expect, it, vi } from "vitest";
import type { MpPaymentGateway } from "@/infrastructure/payments/mp/mp-payment-gateway.interface";
import { makeOrder } from "../testing/order.factory";
import type { VerifyMpPaymentRepository } from "./verify-mp-payment.repository.interface";
import { VerifyMpPaymentUseCase } from "./verify-mp-payment.use-case";

type TestDeps = {
  repository: VerifyMpPaymentRepository;
  gateway: MpPaymentGateway;
  getPaymentStatus: ReturnType<typeof vi.fn>;
  updatePaymentStatus: ReturnType<typeof vi.fn>;
};

function makeDeps(
  overrides: {
    repository?: Partial<VerifyMpPaymentRepository>;
    gateway?: Partial<MpPaymentGateway>;
  } = {},
): TestDeps {
  const getPaymentStatus = vi.fn().mockResolvedValue({
    status: "approved",
    externalReference: "pizzeria-luca-1700000000000",
  });
  const updatePaymentStatus = vi.fn().mockResolvedValue(null);

  const repository: VerifyMpPaymentRepository = {
    findByExternalReference: vi.fn().mockResolvedValue(null),
    updatePaymentStatus,
    ...overrides.repository,
  };

  const gateway: MpPaymentGateway = {
    getPaymentStatus,
    ...overrides.gateway,
  };

  return { repository, gateway, getPaymentStatus, updatePaymentStatus };
}

function makeUseCase(deps: TestDeps): VerifyMpPaymentUseCase {
  return new VerifyMpPaymentUseCase(deps.repository, deps.gateway);
}

describe("VerifyMpPaymentUseCase", () => {
  it("treats efectivo status as cash without contacting MP", async () => {
    const deps = makeDeps();
    const useCase = makeUseCase(deps);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: "efectivo",
      paymentIdParam: null,
    });

    expect(result.verifiedStatus).toBe("efectivo");
    expect(deps.getPaymentStatus).not.toHaveBeenCalled();
  });

  it("resolves pending when no payment_id is present", async () => {
    const deps = makeDeps();
    const useCase = makeUseCase(deps);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: null,
    });

    expect(result.verifiedStatus).toBe("pending");
    expect(deps.getPaymentStatus).not.toHaveBeenCalled();
  });

  it("verifies an approved payment with matching external reference", async () => {
    const dashboardOrder = makeOrder({ shopId: 7 });
    const deps = makeDeps({
      repository: {
        findByExternalReference: vi.fn().mockResolvedValue(dashboardOrder),
      },
    });
    const useCase = makeUseCase(deps);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(result.verifiedStatus).toBe("approved");
    expect(result.isDashboardFlow).toBe(true);
    expect(deps.updatePaymentStatus).toHaveBeenCalledWith(
      "pizzeria-luca-1700000000000",
      "approved",
    );
  });

  it("stays pending on external reference mismatch and writes nothing", async () => {
    const dashboardOrder = makeOrder({ shopId: 7 });
    const deps = makeDeps({
      repository: {
        findByExternalReference: vi.fn().mockResolvedValue(dashboardOrder),
      },
      gateway: {
        getPaymentStatus: vi.fn().mockResolvedValue({
          status: "approved",
          externalReference: "other-shop-999",
        }),
      },
    });
    const useCase = makeUseCase(deps);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(result.verifiedStatus).toBe("pending");
    expect(deps.updatePaymentStatus).not.toHaveBeenCalled();
  });

  it("derives the shop name from the substring before the last dash", async () => {
    const deps = makeDeps();
    const useCase = makeUseCase(deps);

    await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(deps.getPaymentStatus).toHaveBeenCalledWith(
      "pizzeria-luca",
      "pay-123",
    );
  });

  it("resolves pending when MP verification throws", async () => {
    const deps = makeDeps({
      gateway: {
        getPaymentStatus: vi.fn().mockRejectedValue(new Error("MP down")),
      },
    });
    const useCase = makeUseCase(deps);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(result.verifiedStatus).toBe("pending");
  });

  it("resolves pending while keeping the provided payment id when the order id has no shop prefix", async () => {
    const deps = makeDeps();
    const useCase = makeUseCase(deps);

    const result = await useCase.execute({
      orderId: "-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(deps.getPaymentStatus).not.toHaveBeenCalled();
    expect(result.verifiedStatus).toBe("pending");
    expect(result.paymentId).toBe("pay-123");
    expect(result.isDashboardFlow).toBe(false);
  });

  it("normalizes an unknown MP status to pending", async () => {
    const dashboardOrder = makeOrder({ shopId: 7 });
    const deps = makeDeps({
      repository: {
        findByExternalReference: vi.fn().mockResolvedValue(dashboardOrder),
      },
      gateway: {
        getPaymentStatus: vi.fn().mockResolvedValue({
          status: "in_process",
          externalReference: "pizzeria-luca-1700000000000",
        }),
      },
    });
    const useCase = makeUseCase(deps);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(result.verifiedStatus).toBe("pending");
    expect(deps.updatePaymentStatus).toHaveBeenCalledWith(
      "pizzeria-luca-1700000000000",
      "pending",
    );
  });

  it("normalizes an efectivo MP status to pending and writes pending in a dashboard flow", async () => {
    const dashboardOrder = makeOrder({ shopId: 7 });
    const deps = makeDeps({
      repository: {
        findByExternalReference: vi.fn().mockResolvedValue(dashboardOrder),
      },
      gateway: {
        getPaymentStatus: vi.fn().mockResolvedValue({
          status: "efectivo",
          externalReference: "pizzeria-luca-1700000000000",
        }),
      },
    });
    const useCase = makeUseCase(deps);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    // normalizeStatus only trusts approved/rejected; MP's "efectivo" degrades
    // to pending, which also exercises the cash-downgrade write branch.
    expect(result.verifiedStatus).toBe("pending");
    expect(result.paymentId).toBe("pay-123");
    expect(deps.updatePaymentStatus).toHaveBeenCalledWith(
      "pizzeria-luca-1700000000000",
      "pending",
    );
  });

  it("does not write payment status in a non-dashboard flow on success", async () => {
    const deps = makeDeps({
      gateway: {
        getPaymentStatus: vi.fn().mockResolvedValue({
          status: "rejected",
          externalReference: "pizzeria-luca-1700000000000",
        }),
      },
    });
    const useCase = makeUseCase(deps);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(result.verifiedStatus).toBe("rejected");
    expect(result.isDashboardFlow).toBe(false);
    expect(deps.updatePaymentStatus).not.toHaveBeenCalled();
  });
});
