"use client";

export type ErrorTextProps = {
  readonly message: string | null;
};

export function ErrorText({ message }: ErrorTextProps) {
  if (message === null) {
    return null;
  }

  return <p className="mt-3 text-center text-sm text-destructive">{message}</p>;
}
