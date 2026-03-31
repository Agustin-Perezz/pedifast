import type {
  DeliveryMethodValue,
  OrderStatusValue,
  PaymentMethodValue
} from '$schemas/order';

export interface OrderItemAccessory {
  name: string;
  priceDelta: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
  accessories?: OrderItemAccessory[];
}

export interface Order {
  id: number;
  shopId: number;
  externalReference: string;
  customerName: string;
  customerPhone: string | null;
  notes: string | null;
  deliveryMethod: DeliveryMethodValue;
  address: string | null;
  paymentMethod: PaymentMethodValue;
  paymentStatus: string;
  items: OrderItem[];
  total: number;
  deliveryCost: number;
  status: OrderStatusValue;
  createdAt: string;
}

export interface OrderInsert {
  shop_id: number;
  external_reference: string;
  customer_name: string;
  customer_phone?: string | null;
  notes?: string | null;
  delivery_method: DeliveryMethodValue;
  address?: string | null;
  payment_method: PaymentMethodValue;
  payment_status?: string;
  items: OrderItem[];
  total: number;
  delivery_cost?: number;
}

export interface CreateOrderDto {
  externalReference: string;
  customerName: string;
  customerPhone?: string;
  notes?: string;
  deliveryMethod: string;
  address?: string;
  paymentMethod: string;
  paymentStatus?: string;
  items: OrderItem[];
  total: number;
  deliveryCost?: number;
}
