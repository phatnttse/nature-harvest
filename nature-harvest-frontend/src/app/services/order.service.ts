import { CommentDto } from '../dtos/product/comment.dto';
import { OrderResponse } from './../responses/order/order.response';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { OrderDto } from '../dtos/order/order.dto';
import { OrderAndOrderDetailsResponse } from '../responses/order/order-orderdetails-response';
import { environment } from '../environments/environment.development';
import { CommentResponse } from '../responses/comment/comment.response';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiBaseUrl = environment.apiBaseUrl;

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

  getOrdersByUserId(
    userId: string
  ): Observable<OrderAndOrderDetailsResponse[]> {
    return this.http.get<OrderAndOrderDetailsResponse[]>(
      `${this.apiBaseUrl}/orders/user/${userId}`,
      this.apiConfig
    );
  }
}
