import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CategoryProductCountResponse } from '../responses/category/category-product-counts.response';
import { HttpUtilService } from './http.util.service';
import { CategoryResponse } from '../responses/category/category.response';
import { CategoryWithSubcategoriesResponse } from '../responses/category/category-subcategory-response';
import { environment } from '../environments/environment.development';
import { CategoryDto } from '../dtos/category/category.dto';
import { BaseResponse } from '../responses/base/base.response';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiBaseUrl = environment.apiBaseUrl;
  private categoriesWithSubcategoriesSubject = new BehaviorSubject<
    CategoryWithSubcategoriesResponse[]
  >([]);
  categoriesWithSubcategories$ =
    this.categoriesWithSubcategoriesSubject.asObservable();

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {
    this.initCategoriesWithSubcategories();
  }

  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(`${this.apiBaseUrl}/categories`);
  }
  private initCategoriesWithSubcategories() {
    if (this.categoriesWithSubcategoriesSubject.getValue().length === 0) {
      this.getCategoriesWithSubcategories().subscribe();
    }
  }

  getCategoriesWithSubcategories(): Observable<
    CategoryWithSubcategoriesResponse[]
  > {
    return this.http
      .get<CategoryWithSubcategoriesResponse[]>(
        `${this.apiBaseUrl}/categories/with-subcategories`
      )
      .pipe(
        tap((categoriesWithSubcategories) => {
          this.categoriesWithSubcategoriesSubject.next(
            categoriesWithSubcategories
          );
        })
      );
  }

  getCategoryProductCounts(): Observable<CategoryProductCountResponse[]> {
    return this.http.get<CategoryProductCountResponse[]>(
      `${this.apiBaseUrl}/categories/product-counts`
    );
  }

  createCategory(categoryDto: CategoryDto): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      `${this.apiBaseUrl}/categories`,
      categoryDto,
      this.apiConfig
    );
  }
  updateCategory(
    categoryId: number,
    categoryDto: CategoryDto
  ): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(
      `${this.apiBaseUrl}/categories/${categoryId}`,
      categoryDto,
      this.apiConfig
    );
  }

  deleteCategory(categoryId: number): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(
      `${this.apiBaseUrl}/categories/${categoryId}`,
      this.apiConfig
    );
  }
}
