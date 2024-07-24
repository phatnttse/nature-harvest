import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';

import { environment } from '../environments/environment.development';
import { CouponResponse } from '../responses/coupon/coupon.response';
import { CreateCouponDto } from '../dtos/coupon/create.dto';
import { UpdateCouponDto } from '../dtos/coupon/update.dto';
import { BaseResponse } from '../responses/base/base.response';
import { CouponCalculationResponse } from '../responses/coupon/calculate.response';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private apiBaseUrl = environment.apiBaseUrl;
  private usedCoupons: string[] = [];

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };
  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  calculateCouponDiscount(
    couponCode: string,
    totalAmount: number
  ): Observable<CouponCalculationResponse> {
    const params = new HttpParams()
      .set('couponCode', couponCode)
      .set('totalAmount', totalAmount.toString());

    return this.http.get<CouponCalculationResponse>(
      `${this.apiBaseUrl}/coupons/calculate`,
      { params, ...this.apiConfig }
    );
  }

  getCoupons(): Observable<CouponResponse[]> {
    return this.http.get<CouponResponse[]>(
      `${this.apiBaseUrl}/coupons`,
      this.apiConfig
    );
  }
  getCouponById(id: number): Observable<CouponResponse> {
    return this.http.get<CouponResponse>(
      `${this.apiBaseUrl}/coupons/${id}`,
      this.apiConfig
    );
  }
  createCoupon(createCouponDto: CreateCouponDto): Observable<CouponResponse> {
    return this.http.post<CouponResponse>(
      `${this.apiBaseUrl}/coupons`,
      createCouponDto,
      this.apiConfig
    );
  }
  updateCoupon(
    couponId: number,
    coupon: UpdateCouponDto
  ): Observable<CouponResponse> {
    return this.http.patch<CouponResponse>(
      `${this.apiBaseUrl}/coupons/${couponId}`,
      coupon,
      this.apiConfig
    );
  }
  deleteCoupon(couponId: number): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(
      `${this.apiBaseUrl}/coupons/${couponId}`,
      this.apiConfig
    );
  }
  getUsedCoupons(): string[] {
    return this.usedCoupons;
  }

  addUsedCoupon(couponCode: string): void {
    this.usedCoupons.push(couponCode);
  }
  clearCoupons(): void {
    this.usedCoupons = [];
  }
}
