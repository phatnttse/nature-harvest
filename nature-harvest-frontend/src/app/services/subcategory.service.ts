import { SubcategoryDto } from './../dtos/category/subcategory.dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryProductCountResponse } from '../responses/category/category-product-counts.response';
import { HttpUtilService } from './http.util.service';
import { SubCategoryResponse } from '../responses/subcategory/subcategory.response';
import { environment } from '../environments/environment.development';
import { BaseResponse } from '../responses/base/base.response';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private apiBaseUrl = environment.apiBaseUrl;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  getSubCategoriesByCategory(
    categoryId: number
  ): Observable<SubCategoryResponse[]> {
    return this.http.get<SubCategoryResponse[]>(
      `${this.apiBaseUrl}/subcategories/category/${categoryId}`
    );
  }
  createSubcategory(subcategoryDto: SubcategoryDto): Observable<BaseResponse> {
    return this.http.post<BaseResponse>(
      `${this.apiBaseUrl}/subcategories`,
      subcategoryDto,
      this.apiConfig
    );
  }
  updateSubcategory(
    subcategoryId: number,
    subcategoryDto: SubcategoryDto
  ): Observable<BaseResponse> {
    return this.http.put<BaseResponse>(
      `${this.apiBaseUrl}/subcategories/${subcategoryId}`,
      subcategoryDto,
      this.apiConfig
    );
  }
  deleteSubCategory(subcategoryId: number): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(
      `${this.apiBaseUrl}/subcategories/${subcategoryId}`,
      this.apiConfig
    );
  }
}
