"use client";

import { createContext, useCallback, useContext, useState } from "react";

const CheckoutOpenContext = createContext<{
  readonly isOpen: boolean;
  readonly openCheckout: () => void;
  readonly closeCheckout: () => void;
} | null>(null);

export function CheckoutOpenProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
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
