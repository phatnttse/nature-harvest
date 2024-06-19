import { CategoryResponse } from '../category/category.response';

export class SubCategoryResponse {
  id: number;
  name: string;
  category: CategoryResponse[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
  }
}
