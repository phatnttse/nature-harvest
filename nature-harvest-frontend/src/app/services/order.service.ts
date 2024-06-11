import { OrderResponse } from './../responses/order/order.response';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { OrderDto } from '../dtos/order/order.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiBaseUrl = environment.apiBaseUrl;
  private order: OrderResponse | null = null;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  placeOrder(orderDto: OrderDto): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      `${this.apiBaseUrl}/orders`,
      orderDto,
      this.apiConfig
    );
  }
  getOrderByOrderId(orderId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(
      `${this.apiBaseUrl}/orders/${orderId}`,
      this.apiConfig
    );
  }
  setOrder(order: OrderResponse) {
    this.order = order;
  }
  getOrder(): OrderResponse | null {
    return this.order;
  }
}
