// import { Injectable } from '@angular/core';
// import { environment } from '../environments/environment';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { CategoryProductCountResponse } from '../responses/category/category-product-counts.response';
// import { HttpUtilService } from './http.util.service';
// import { SubCategoryResponse } from '../responses/subcategory/subcategory.response';

// @Injectable({
//   providedIn: 'root',
// })
// export class SubCategoryService {
//   private apiGetSubCategoriesByCategory = `${environment.apiBaseUrl}/subcategories/category`;

//   private apiConfig = {
//     headers: this.httpUtilService.createHeaders(),
//   };

//   constructor(
//     private http: HttpClient,
//     private httpUtilService: HttpUtilService
//   ) {}

//   getSubCategoriesByCategory(
//     categoryId: number
//   ): Observable<SubCategoryResponse[]> {
//     return this.http.get<SubCategoryResponse[]>(
//       `${this.apiGetSubCategoriesByCategory}/${categoryId}`
//     );
//   }
// }
