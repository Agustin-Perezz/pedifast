export type MpPreferenceItem = {
  readonly title: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly currencyId: string;
};

export type MpPreferenceMetadata = {
  readonly shopName: string;
  readonly nombre: string;
  readonly notas: string;
  readonly deliveryMethod: string;
  readonly address: string;
};
