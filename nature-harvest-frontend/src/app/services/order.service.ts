import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { OrderResponse } from '../responses/order/order.response';
import { OrderDto } from '../dtos/order/order.dto';

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

  order(orderDto: OrderDto): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(
      `${this.apiBaseUrl}/order`,
      this.apiConfig
    );
  }
}
