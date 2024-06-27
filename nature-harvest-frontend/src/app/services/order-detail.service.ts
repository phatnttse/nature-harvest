import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { OrderDetailResponse } from '../responses/order/order-detail.response';
import { OrderDetailDto } from '../dtos/order-detail/order-detail.dto';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  private apiBaseUrl = environment.apiBaseUrl;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  getOrderDetails(orderId: string): Observable<OrderDetailResponse[]> {
    return this.http.get<OrderDetailResponse[]>(
      `${this.apiBaseUrl}/order-details/order/${orderId}`
    );
  }
}
