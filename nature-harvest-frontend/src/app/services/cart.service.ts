import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { CartResponse } from '../responses/cart/cart.response';
import { CartDto } from '../dtos/cart/cart.dto';
import { RemoveCartDto } from '../dtos/cart/remove-cart-item.dto';
import { CartListResponse } from '../responses/cart/cart-list.response';
import { CartSizeResponse } from '../responses/cart/cart-size.response';

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
}
