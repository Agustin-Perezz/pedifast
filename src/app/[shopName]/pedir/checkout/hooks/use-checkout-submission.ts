"use client";

import { useState } from "react";

import type { CheckoutFieldError } from "../../lib/submit-checkout";

export type CheckoutSubmissionState = {
  readonly error: string | null;
  readonly fieldError: CheckoutFieldError | null;
  readonly submitting: boolean;
  readonly missingRequiredGroups: boolean;
  readonly setError: (error: string | null) => void;
  readonly setFieldError: (field: CheckoutFieldError) => void;
  readonly clearFieldError: () => void;
  readonly setMissingRequiredGroups: (missing: boolean) => void;
  readonly setSubmitting: (submitting: boolean) => void;
};

export function useCheckoutSubmission(): CheckoutSubmissionState {
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<CheckoutFieldError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [missingRequiredGroups, setMissingRequiredGroups] = useState(false);

  function handleError(nextError: string | null): void {
    setError(nextError);
    setFieldError(null);
  }

  function handleFieldError(field: CheckoutFieldError): void {
    setFieldError(field);
    setError(null);
  }

  function clearFieldError(): void {
    setFieldError(null);
  }

  return {
    error,
    fieldError,
    submitting,
    missingRequiredGroups,
    setError: handleError,
    setFieldError: handleFieldError,
    clearFieldError,
    setMissingRequiredGroups,
    setSubmitting,
  };
}
