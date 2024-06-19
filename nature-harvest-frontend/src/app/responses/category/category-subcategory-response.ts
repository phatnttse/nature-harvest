import { SubCategoryResponse } from '../subcategory/subcategory.response';

export class CategoryWithSubcategoriesResponse {
  id: number;
  name: string;
  subcategories: SubCategoryResponse[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.subcategories = data.subcategories;
  }
}
