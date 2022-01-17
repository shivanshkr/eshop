/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { OrdersService } from '@bluebits/orders';
import { ProductsService } from '@bluebits/products';
import { UsersService } from '@bluebits/users';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  constructor(
    private userService: UsersService,
    private ordersService: OrdersService,
    private productService: ProductsService
  ) {}

  userCount!: number;
  orderCount!: number;
  productCount!: number;
  totalSales!: number;

  ngOnInit(): void {
    this._getUsersCount();
    this._getTotalSales();
    this._getProductsCount();
    this._getOrdersCount();
  }

  private _getUsersCount() {
    this.userService.getUsersCount().subscribe((res) => {
      this.userCount = res.userCount;
    });
  }
  private _getProductsCount() {
    this.productService.getProductCount().subscribe((res) => {
      this.productCount = res?.productCount;
    });
  }
  private _getOrdersCount() {
    this.ordersService.getOrderCount().subscribe((res) => {
      this.orderCount = res?.orderCount;
    });
  }
  private _getTotalSales() {
    this.ordersService.getTotalSales().subscribe((res) => {
      this.totalSales = res?.totalSales;
    });
  }
}
