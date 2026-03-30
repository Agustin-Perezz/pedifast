import type { MercadoPagoClient } from '$lib/server/mp-client';
import type { OrdersService } from '$lib/server/services/orders.service';
import type { ShopsService } from '$lib/server/services/shops.service';

declare module '*.svg' {
  const src: string;
  export default src;
}

declare global {
  namespace App {
    interface Locals {
      shopsService: ShopsService;
      ordersService: OrdersService;
      mpClient: MercadoPagoClient;
    }
  }
}

export {};
