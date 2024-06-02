import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryProductCountResponse } from '../responses/category/category-product-counts.response';
import { HttpUtilService } from './http.util.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiGetCategoryProductCounts = `${environment.apiBaseUrl}/categories/product-counts`;
  private apiGetSubCategoriesByCategory = `${environment.apiBaseUrl}/categories/product-counts`;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  getCategoryProductCounts(): Observable<CategoryProductCountResponse[]> {
    return this.http.get<CategoryProductCountResponse[]>(
      this.apiGetCategoryProductCounts
    );
  }
}
