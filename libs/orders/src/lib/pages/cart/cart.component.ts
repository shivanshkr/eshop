import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '@bluebits/products';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Cart, cartItemsDetailed } from '../../Models/cart';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart.component.html',
  styles: [],
  providers: [MessageService],
})
export class CartComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private cartService: CartService,
    private orderService: OrdersService,
    private messageService: MessageService
  ) {}

  endSubs$: Subject<any> = new Subject();
  quantity!: number;
  cartCount = 0;
  cartItemsDetailed: cartItemsDetailed[] = [];

  ngOnInit(): void {
    this._getCartDetails();
  }

  _getCartDetails() {
    this.cartService.cart$
      .pipe(takeUntil(this.endSubs$))
      .subscribe((resCart) => {
        this.cartItemsDetailed = [];
        this.cartCount = resCart?.items?.length ?? 0;
        resCart.items?.forEach((cartItem) => {
          this.orderService
            .getProduct(cartItem.productId as string)
            .pipe(take(1))
            .subscribe((resProduct) => {
              this.cartItemsDetailed.push({
                product: resProduct,
                quantity: cartItem.quantity,
              });
            });
        });
      });
  }
  backToShop() {
    this.router.navigate(['/products']);
  }
  deleteCartItem(cartItem: cartItemsDetailed) {
    const cart = this.cartService.deleteCartItem(cartItem.product.id);
    if (cart) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Cart Updated`,
      });
    }
  }

  updateCartItemQuantity(event: { value: any }, cartItem: cartItemsDetailed) {
    this.cartService.setCartItem(
      {
        productId: cartItem.product.id,
        quantity: event.value,
      },
      true
    );
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
}
