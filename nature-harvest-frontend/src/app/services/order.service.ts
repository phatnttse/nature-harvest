import { HandleOrderDto } from './../dtos/order/handle-order.dto';
import { OrderResponse } from './../responses/order/order.response';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { OrderDto } from '../dtos/order/order.dto';
import { OrderAndOrderDetailsResponse } from '../responses/order/order-orderdetails-response';
import { environment } from '../environments/environment.development';
import { OrderListResponse } from '../responses/order/order-list.response';
import { BaseResponse } from '../responses/base/base.response';
import { UpdateOrderDto } from '../dtos/order/update.dto';

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
  getOrderByOrderId(orderId: string): Observable<OrderAndOrderDetailsResponse> {
    return this.http.get<OrderAndOrderDetailsResponse>(
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

  getOrders(
    keyword: string,
    page: number,
    limit: number
  ): Observable<OrderListResponse> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<OrderListResponse>(`${this.apiBaseUrl}/orders`, {
      params,
    });
  }

  handleOrder(
    handleOrderDto: HandleOrderDto
  ): Observable<OrderAndOrderDetailsResponse> {
    return this.http.patch<OrderAndOrderDetailsResponse>(
      `${this.apiBaseUrl}/orders/handle`,
      handleOrderDto,
      this.apiConfig
    );
  }

  updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto
  ): Observable<OrderAndOrderDetailsResponse> {
    return this.http.patch<OrderAndOrderDetailsResponse>(
      `${this.apiBaseUrl}/orders/${orderId}`,
      updateOrderDto,
      this.apiConfig
    );
  }

  deleteOrder(orderId: string): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(
      `${this.apiBaseUrl}/orders/${orderId}`,
      this.apiConfig
    );
  }
}
