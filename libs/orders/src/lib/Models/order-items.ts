import { Product } from '@bluebits/products';
export class OrderItems {
  product?: Product;
  quantity?: number;
}

export class OrderItemsPost {
  product?: string;
  quantity?: number;
}
