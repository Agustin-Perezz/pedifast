"use client";

import { createContext, useCallback, useContext, useState } from "react";

type CheckoutOpenContextValue = {
  readonly isOpen: boolean;
  readonly openCheckout: () => void;
  readonly closeCheckout: () => void;
};

const CheckoutOpenContext = createContext<CheckoutOpenContextValue | null>(
  null,
);

type CheckoutOpenProviderProps = {
  readonly children: React.ReactNode;
};

export function CheckoutOpenProvider({ children }: CheckoutOpenProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CheckoutOpenContext.Provider
      value={{
        isOpen,
        openCheckout: useCallback(() => setIsOpen(true), []),
        closeCheckout: useCallback(() => setIsOpen(false), []),
      }}
    >
      {children}
    </CheckoutOpenContext.Provider>
  );
}

export function useCheckoutOpen() {
  const context = useContext(CheckoutOpenContext);

  if (!context) {
    throw new Error(
      "useCheckoutOpen must be used within a CheckoutOpenProvider",
    );
  }

  return context;
}
