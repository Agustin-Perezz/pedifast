import type { MercadoPagoClient } from '$lib/server/mp-client';
import type { ShopsService } from '$lib/server/services/shops.service';

declare module '*.svg' {
  const src: string;
  export default src;
}

declare global {
  namespace App {
    interface Locals {
      shopsService: ShopsService;
      mpClient: MercadoPagoClient;
    }
  }
}

export {};
