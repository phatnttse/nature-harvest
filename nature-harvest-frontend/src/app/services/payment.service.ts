import { appConfig } from './../app.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { OrderResponse } from '../responses/order/order.response';
import { OrderDto } from '../dtos/order/order.dto';
import { VnPayPaymentDto } from '../dtos/payment/vnpay-payment.dto';
import { MoMoPaymentDto } from '../dtos/payment/momo-payment.dto';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiBaseUrl = environment.apiBaseUrl;
  orderDto: OrderDto | null = null;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  vnPayPayment(vnPayPaymentDto: VnPayPaymentDto): Observable<string> {
    const options = {
      ...this.apiConfig,
      responseType: 'text' as 'json', // This ensures responseType is 'text'
    };

    return this.http.post<string>(
      `${this.apiBaseUrl}/payment/vnpay-pay`,
      vnPayPaymentDto,
      options
    );
  }

  moMoPayment(moMoPaymentDto: MoMoPaymentDto): Observable<string> {
    const options = {
      ...this.apiConfig,
      responseType: 'text' as 'json', // This ensures responseType is 'text'
    };

    return this.http.post<string>(
      `${this.apiBaseUrl}/payment/momo-pay`,
      moMoPaymentDto,
      options
    );
  }

  setOrderInfo(orderDto: OrderDto) {
    this.orderDto = orderDto;
  }
  getOrderInfo() {
    return this.orderDto;
  }
}
