import { OrderItems, OrderItemsPost } from './order-items';
import { User } from '@bluebits/users';
export class Order {
  id?: string;
  orderItems?: OrderItems[];
  shippingAddress1?: string;
  shippingAddress2?: string;
  zip?: number;
  city?: number;
  country?: boolean;
  phone?: string;
  status?: number;
  totalPrice?: string;
  user?: User;
  dateOrdered?: string;
}

export class OrderPost {
  id?: string;
  orderItems?: OrderItemsPost[];
  shippingAddress1?: string;
  shippingAddress2?: string;
  zip?: number;
  city?: number;
  country?: boolean;
  phone?: string;
  status?: number;
  totalPrice?: string;
  user?: string;
  dateOrdered?: string;
}
