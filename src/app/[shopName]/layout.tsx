import type { ReactNode } from "react";

import { CartProvider } from "./pedir/context/CartProvider";

type ShopLayoutProps = {
  readonly children: ReactNode;
};

export default function ShopLayout({ children }: ShopLayoutProps) {
  return <CartProvider>{children}</CartProvider>;
}
