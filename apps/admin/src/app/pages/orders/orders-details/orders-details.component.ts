import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@bluebits/orders';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'admin-orders-details',
  templateUrl: './orders-details.component.html',
  styles: [],
})
export class OrdersDetailsComponent implements OnInit {
  orderStatuses: { id: string; name: string }[] = [];
  order: Order = {};
  orderId = '';
  selectedStatus: number | undefined;

  constructor(
    private orderService: OrdersService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }
  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      return { id: key, name: ORDER_STATUS[key].label };
    });
  }

  getSubtotal(quantity: number = 0, price: number = 0) {
    return quantity * price;
  }

  onStatusChange() {
    console.log(this.selectedStatus);
    const reqJSON = {
      status: this.selectedStatus,
    };
    this.orderService.updateOrder(this.orderId, reqJSON).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Order Status is Updated!`,
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Order Status is not Updated!',
        });
      }
    );
  }

  private _getOrder() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.orderId = params.id;
        this.orderService.getOrder(params.id).subscribe((res) => {
          this.order = res;
          this.selectedStatus = res.status;
        });
      }
    });
  }
}
