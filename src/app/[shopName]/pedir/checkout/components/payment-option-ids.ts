export const PAYMENT_PROTECTED_LABEL = "100% protegido";

export type PaymentOptionIdsPair = {
  readonly mercadoPagoTestId: string;
  readonly mercadoPagoInputId: string;
  readonly efectivoTestId: string;
  readonly efectivoInputId: string;
};

export const PAYMENT_OPTION_IDS: PaymentOptionIdsPair = {
  mercadoPagoTestId: "payment-mercadopago",
  mercadoPagoInputId: "payment-mercadopago-input",
  efectivoTestId: "payment-efectivo",
  efectivoInputId: "payment-efectivo-input",
};

export type CashAmountValue = "12000" | "15000" | "20000" | "exact";

export const CASH_AMOUNT_OPTIONS: readonly CashAmountValue[] = [
  "12000",
  "15000",
  "20000",
  "exact",
];

export const CASH_AMOUNT_LABELS: Readonly<Record<CashAmountValue, string>> = {
  "12000": "$12.000",
  "15000": "$15.000",
  "20000": "$20.000",
  exact: "Exacto",
};
