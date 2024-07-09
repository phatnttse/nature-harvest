import { CategoryResponse } from '../category/category.response';

export class SubCategoryResponse {
  id: number;
  name: string;
  slug: string;
  category: CategoryResponse;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.category = data.category;
  }
}
