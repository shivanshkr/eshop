/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderPost } from '../Models/order';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  apiURlProducts = environment.apiURl + 'products';
  apiURlOrders = environment.apiURl + 'orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURlOrders);
  }

  createOrders(order: OrderPost): Observable<Order> {
    return this.http.post<Order>(this.apiURlOrders, order);
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURlOrders}/${orderId}`);
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiURlOrders}/${orderId}`);
  }

  updateOrder(orderId: string, order: any): Observable<Order> {
    return this.http.put<Order>(`${this.apiURlOrders}/${orderId}`, order);
  }

  getOrderCount(): Observable<any> {
    return this.http.get<any>(`${this.apiURlOrders}/get/count`);
  }

  getTotalSales(): Observable<any> {
    return this.http.get<any>(`${this.apiURlOrders}/get/totalsells`);
  }
  getProduct(productId: string): Observable<any> {
    return this.http.get<any>(`${this.apiURlProducts}/${productId}`);
  }
}
