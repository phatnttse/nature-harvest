import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { ProductListResponse } from '../responses/product/product-list.response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiGetProducts = `${environment.apiBaseUrl}/products`;

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
    return this.http.get<ProductListResponse>(this.apiGetProducts, { params });
  }
}
