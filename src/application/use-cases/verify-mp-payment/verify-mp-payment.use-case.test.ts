import { describe, expect, it, vi } from "vitest";
import { makeOrder } from "../testing/order.factory";
import type { VerifyMpPaymentRepository } from "./verify-mp-payment.repository.interface";
import { VerifyMpPaymentUseCase } from "./verify-mp-payment.use-case";

function makeRepository(overrides: Partial<VerifyMpPaymentRepository> = {}): {
  repository: VerifyMpPaymentRepository;
  getPaymentStatus: ReturnType<typeof vi.fn>;
  updatePaymentStatus: ReturnType<typeof vi.fn>;
} {
  const getPaymentStatus = vi.fn().mockResolvedValue({
    status: "approved",
    externalReference: "pizzeria-luca-1700000000000",
  });
  const updatePaymentStatus = vi.fn().mockResolvedValue(null);

  const repository: VerifyMpPaymentRepository = {
    findByExternalReference: vi.fn().mockResolvedValue(null),
    getPaymentStatus,
    updatePaymentStatus,
    getSellerAccessToken: vi.fn().mockResolvedValue("seller-token"),
    ...overrides,
  };

  return { repository, getPaymentStatus, updatePaymentStatus };
}

describe("VerifyMpPaymentUseCase", () => {
  it("treats efectivo status as cash without contacting MP", async () => {
    const { repository, getPaymentStatus } = makeRepository();
    const useCase = new VerifyMpPaymentUseCase(repository);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: "efectivo",
      paymentIdParam: null,
    });

    expect(result.verifiedStatus).toBe("efectivo");
    expect(getPaymentStatus).not.toHaveBeenCalled();
  });

  it("resolves pending when no payment_id is present", async () => {
    const { repository, getPaymentStatus } = makeRepository();
    const useCase = new VerifyMpPaymentUseCase(repository);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: null,
    });

    expect(result.verifiedStatus).toBe("pending");
    expect(getPaymentStatus).not.toHaveBeenCalled();
  });

  it("verifies an approved payment with matching external reference", async () => {
    const dashboardOrder = makeOrder({ shopId: 7 });
    const { repository, updatePaymentStatus } = makeRepository({
      findByExternalReference: vi.fn().mockResolvedValue(dashboardOrder),
    });
    const useCase = new VerifyMpPaymentUseCase(repository);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(result.verifiedStatus).toBe("approved");
    expect(result.isDashboardFlow).toBe(true);
    expect(updatePaymentStatus).toHaveBeenCalledWith(
      "pizzeria-luca-1700000000000",
      "approved",
    );
  });

  it("stays pending on external reference mismatch and writes nothing", async () => {
    const dashboardOrder = makeOrder({ shopId: 7 });
    const { repository, updatePaymentStatus } = makeRepository({
      findByExternalReference: vi.fn().mockResolvedValue(dashboardOrder),
      getPaymentStatus: vi.fn().mockResolvedValue({
        status: "approved",
        externalReference: "other-shop-999",
      }),
    });
    const useCase = new VerifyMpPaymentUseCase(repository);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(result.verifiedStatus).toBe("pending");
    expect(updatePaymentStatus).not.toHaveBeenCalled();
  });

  it("derives the shop name from the substring before the last dash", async () => {
    const { repository, getPaymentStatus } = makeRepository();
    const useCase = new VerifyMpPaymentUseCase(repository);

    await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(getPaymentStatus).toHaveBeenCalledWith("pizzeria-luca", "pay-123");
  });

  it("resolves pending when MP verification throws", async () => {
    const { repository } = makeRepository({
      getPaymentStatus: vi.fn().mockRejectedValue(new Error("MP down")),
    });
    const useCase = new VerifyMpPaymentUseCase(repository);

    const result = await useCase.execute({
      orderId: "pizzeria-luca-1700000000000",
      statusParam: null,
      paymentIdParam: "pay-123",
    });

    expect(result.verifiedStatus).toBe("pending");
  });
});
