import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { ProductListResponse } from '../responses/product/product-list.response';
import { ProductResponse } from '../responses/product/product.response';
import { ProductDetailResponse } from '../responses/product/product-detail.response';
import { CartResponse } from '../responses/cart/cart.response';
import { CartDto } from '../dtos/cart/cart.dto';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiBaseUrl = environment.apiBaseUrl;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  getCart(token: string): Observable<CartResponse[]> {
    return this.http.get<CartResponse[]>(`${this.apiBaseUrl}/cart`);
  }
  addProductToCart(cartDto: CartDto): Observable<CartResponse[]> {
    return this.http.get<CartResponse[]>(`${this.apiBaseUrl}/cart/add`);
  }
  removeProductToCart(cartDto: CartDto): Observable<CartResponse[]> {
    return this.http.get<CartResponse[]>(`${this.apiBaseUrl}/cart/remove`);
  }
}
