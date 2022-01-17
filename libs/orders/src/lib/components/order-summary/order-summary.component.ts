import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CartItem } from '../../Models/cart';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'orders-order-summary',
  templateUrl: './order-summary.component.html',
  styles: [],
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
  endSubs$: Subject<any> = new Subject();
  totalPrice = 0;
  isCheckoutPage = false;

  constructor(
    private cartService: CartService,
    private ordersService: OrdersService,
    private router: Router
  ) {
    this.isCheckoutPage = this.router.url.includes('checkout') ? true : false;
  }

  ngOnInit(): void {
    this._getOrderSummary();
  }
  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  _getOrderSummary() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cart) => {
      this.totalPrice = 0;
      if (cart) {
        cart.items?.map((item: CartItem) => {
          this.ordersService
            .getProduct(item.productId as string)
            .pipe(take(1))
            .subscribe((product) => {
              this.totalPrice += product.price * (item.quantity as number);
            });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.endSubs$.next();
    this.endSubs$.complete();
  }
}
