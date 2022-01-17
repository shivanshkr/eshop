import { Component, Input, OnInit } from '@angular/core';
import { Cart, CartItem, CartService } from '@bluebits/orders';
import { Product } from '../../Models/product';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'products-product-item',
  templateUrl: './product-item.component.html',
  styles: [],
  providers: [MessageService],
})
export class ProductItemComponent implements OnInit {
  @Input() product!: Product;
  constructor(
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}
  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: 1,
    };

    const cart: Cart = this.cartService.setCartItem(cartItem);
    if (cart) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${this.product.name} added to Cart`,
      });
    }
  }
}
