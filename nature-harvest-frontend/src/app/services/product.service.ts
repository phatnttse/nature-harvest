import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { ProductListResponse } from '../responses/product/product-list.response';
import { ProductDetailResponse } from '../responses/product/product-detail.response';
import { environment } from '../environments/environment.development';
import { CreateProductDto } from '../dtos/product/create.dto';
import { ProductResponse } from '../responses/product/product.response';
import { ProductImage } from '../responses/product/product-image.response';
import { ProductImageDto } from '../dtos/product/product-image.dto';
import { UpdateProductDto } from '../dtos/product/update.dto';
import { BaseResponse } from '../responses/base/base.response';

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

  createProduct(
    createProductDto: CreateProductDto
  ): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(
      `${this.apiBaseUrl}/products`,
      createProductDto,
      this.apiConfig
    );
  }

  updateProduct(
    productId: number,
    updateProductDto: UpdateProductDto
  ): Observable<ProductDetailResponse> {
    return this.http.put<ProductDetailResponse>(
      `${this.apiBaseUrl}/products/${productId}`,
      updateProductDto,
      this.apiConfig
    );
  }

  updateProductImage(
    productId: number,
    productImageDto: ProductImageDto
  ): Observable<ProductImage[]> {
    return this.http.post<ProductImage[]>(
      `${this.apiBaseUrl}/products/update-images/${productId}`,
      productImageDto,
      this.apiConfig
    );
  }

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

  getDetailProductBySlug(slug: string): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(
      `${this.apiBaseUrl}/products/slug/${slug}`
    );
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

  deleteProduct(productId: number): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(
      `${this.apiBaseUrl}/products/${productId}`,
      this.apiConfig
    );
  }
}
