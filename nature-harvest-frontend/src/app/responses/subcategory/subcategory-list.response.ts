import { CategoryResponse } from '../category/category.response';

export class SubcategoryListResponse {
  subcategories: CategoryResponse[];

  constructor(data: any) {
    this.subcategories = data.subcategories;
  }
}
