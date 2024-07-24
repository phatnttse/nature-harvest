import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { CartResponse } from '../responses/cart/cart.response';
import { CartDto } from '../dtos/cart/cart.dto';
import { RemoveCartDto } from '../dtos/cart/remove-cart-item.dto';
import { CartListResponse } from '../responses/cart/cart-list.response';
import { CartSizeResponse } from '../responses/cart/cart-size.response';
import { ClearCartDto } from '../dtos/cart/clear-cart.dto';
import { environment } from '../environments/environment.development';
import { BaseResponse } from '../responses/base/base.response';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiBaseUrl = environment.apiBaseUrl;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  private cartSubject = new BehaviorSubject<CartListResponse>({ cart: [] });
  cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  getCart(): Observable<CartListResponse> {
    return this.http.get<CartListResponse>(
      `${this.apiBaseUrl}/cart`,
      this.apiConfig
    );
  }

  addProductToCart(cartDto: CartDto): Observable<CartListResponse> {
    return this.http.post<CartListResponse>(
      `${this.apiBaseUrl}/cart/add`,
      cartDto,
      this.apiConfig
    );
  }

  removeProductFromCart(
    removeCartDto: RemoveCartDto
  ): Observable<CartListResponse> {
    return this.http.post<CartListResponse>(
      `${this.apiBaseUrl}/cart/remove`,
      removeCartDto,
      this.apiConfig
    );
  }

  updateQuantity(cartDto: CartDto): Observable<CartListResponse> {
    return this.http.post<CartListResponse>(
      `${this.apiBaseUrl}/cart/update-quantity`,
      cartDto,
      this.apiConfig
    );
  }

  getCartSize(): Observable<CartSizeResponse> {
    return this.http.get<CartSizeResponse>(
      `${this.apiBaseUrl}/cart/cart-size`,
      this.apiConfig
    );
  }
  updateCartState(cartData: CartListResponse): void {
    this.cartSubject.next(cartData);
  }

  clearCart(clearCartDto: ClearCartDto): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      `${this.apiBaseUrl}/cart/clear-cart`,
      clearCartDto,
      this.apiConfig
    );
  }
}
