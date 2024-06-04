import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { ProductListResponse } from '../responses/product/product-list.response';
import { ProductResponse } from '../responses/product/product.response';
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
    page: number,
    limit: number
  ): Observable<ProductListResponse> {
    const params = {
      keyword: keyword,
      categoryId: categoryId.toString(),
      // subcategoryId: subcategoryId?.toString() || null,
      page: page.toString(),
      limit: limit.toString(),
    };
    return this.http.get<ProductListResponse>(`${this.apiBaseUrl}/products`, {
      params,
    });
  }

  getDetailProduct(productId: number): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(
      `${this.apiBaseUrl}/products/${productId}`
    );
  }
}
