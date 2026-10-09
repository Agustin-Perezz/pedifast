export type FieldErrorTextProps = {
  readonly message: string | null;
};

export function FieldErrorText({ message }: FieldErrorTextProps) {
  if (message === null) {
    return null;
  }

  return (
    <p
      role="alert"
      className="text-xs font-medium text-destructive"
      data-testid="checkout-field-error"
    >
      {message}
    </p>
  );
}
