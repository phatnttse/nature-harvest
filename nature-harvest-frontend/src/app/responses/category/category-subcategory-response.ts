import { SubCategoryResponse } from '../subcategory/subcategory.response';

export class CategoryWithSubcategoriesResponse {
  id: number;
  name: string;
  thumbnail: string;
  slug: string;
  subcategories: SubCategoryResponse[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.thumbnail = data.thumbnail;
    this.slug = data.slug;
    this.subcategories = data.subcategories;
  }
}
