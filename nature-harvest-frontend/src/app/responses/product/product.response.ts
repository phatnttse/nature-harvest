import { CategoryResponse } from '../category/category.response';

export class ProductResponse {
  id: number;
  title: string;
  originalPrice: number;
  officialPrice: number;
  thumbnail: string;
  description: string;
  slug: string;
  quantity: number;
  discount: number;
  purchases: number;
  averageRating: number;
  category: CategoryResponse;
  // subCategoryId: number;
  totalPages: number;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.originalPrice = data.originalPrice;
    this.officialPrice = data.officialPrice;
    this.thumbnail = data.thumbnail;
    this.description = data.description;
    this.slug = data.slug;
    this.quantity = data.quantity;
    this.discount = data.discount;
    this.purchases = data.purchases;
    this.averageRating = data.averageRating;
    this.category = data.category;
    // this.subCategoryId = data.subCategoryId;
    this.totalPages = data.totalPages;
  }
}
