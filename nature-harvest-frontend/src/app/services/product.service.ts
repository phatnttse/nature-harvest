import { ProductResponse } from './../responses/product/product.response';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { ProductListResponse } from '../responses/product/product-list.response';
import { ProductDetailResponse } from '../responses/product/product-detail.response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiBaseUrl = environment.apiBaseUrl;
  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  getProducts(
    keyword: string,
    categoryId: number,
    subcategoryId: number,
    sortBy: string,
    arrange: string,
    page: number,
    limit: number
  ): Observable<ProductListResponse> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('categoryId', categoryId)
      .set('subcategoryId', subcategoryId)
      .set('sortBy', sortBy)
      .set('arrange', arrange)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<ProductListResponse>(`${this.apiBaseUrl}/products`, {
      params,
    });
  }

  getProductsByCondition(
    minPrice: number,
    maxPrice: number,
    keyword: string,
    categoryId: number,
    subcategoryId: number,
    sortBy: string,
    arrange: string,
    page: number,
    limit: number
  ): Observable<ProductListResponse> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('categoryId', categoryId)
      .set('subcategoryId', subcategoryId)
      .set('sortBy', sortBy)
      .set('arrange', arrange)
      .set('minPrice', minPrice)
      .set('maxPrice', maxPrice)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<ProductListResponse>(`${this.apiBaseUrl}/products`, {
      params,
    });
  }

  getDetailProduct(productId: number): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(
      `${this.apiBaseUrl}/products/${productId}`
    );
  }
  filterProductsByPrice(
    minPrice: number,
    maxPrice: number,
    keyword: string,
    categoryId: number,
    subcategoryId: number,
    sortBy: string,
    arrange: string,
    page: number,
    limit: number
  ): Observable<ProductListResponse> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('categoryId', categoryId)
      .set('subcategoryId', subcategoryId)
      .set('sortBy', sortBy)
      .set('arrange', arrange)
      .set('minPrice', minPrice)
      .set('maxPrice', maxPrice)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<ProductListResponse>(`${this.apiBaseUrl}/products`, {
      params,
    });
  }
}
