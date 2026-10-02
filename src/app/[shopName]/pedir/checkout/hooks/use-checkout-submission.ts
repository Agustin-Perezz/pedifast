"use client";

import { useState } from "react";

export type CheckoutSubmissionState = {
  readonly error: string | null;
  readonly submitting: boolean;
  readonly setError: (error: string | null) => void;
  readonly setSubmitting: (submitting: boolean) => void;
};

export function useCheckoutSubmission(): CheckoutSubmissionState {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return { error, submitting, setError, setSubmitting };
}
