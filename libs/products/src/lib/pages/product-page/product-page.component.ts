/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cart, CartItem, CartService } from '@bluebits/orders';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../../Models/product';
import { ProductsService } from '../../services/products.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'products-product-page',
  templateUrl: './product-page.component.html',
  styles: [],
  providers: [MessageService],
})
export class ProductPageComponent implements OnInit, OnDestroy {
  product!: Product;
  endSubs$: Subject<any> = new Subject();
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private PS: ProductsService,
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this._getProduct(params.id);
      }
    });
  }

  _getProduct(id: string) {
    this.PS.getProduct(id)
      .pipe(takeUntil(this.endSubs$))
      .subscribe((res) => {
        this.product = res;
      });
  }

  addProductToCart() {
    const cartItem: CartItem = {
      productId: this.product.id,
      quantity: this.quantity,
    };
    const cart: Cart = this.cartService.setCartItem(cartItem);
    if (cart) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${this.quantity} ${this.product.name} added to Cart`,
      });
    }
    this.quantity = 1;
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
}
