export type VerifiedPaymentStatus =
  | "efectivo"
  | "pending"
  | "approved"
  | "rejected";

export type VerifyMpPaymentResponseDto = {
  readonly verifiedStatus: VerifiedPaymentStatus;
  readonly paymentId: string | null;
  readonly isDashboardFlow: boolean;
};
