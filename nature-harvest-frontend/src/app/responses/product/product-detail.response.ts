import { CategoryResponse } from '../category/category.response';
import { ProductImage } from './product-image.response';

export class ProductDetailResponse {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  quantity: number;
  discount: number;
  purchases: number;
  averageRating: number;
  category: CategoryResponse;
  productImages: ProductImage[];

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.price = data.price;
    this.thumbnail = data.thumbnail;
    this.description = data.description;
    this.quantity = data.quantity;
    this.discount = data.discount;
    this.purchases = data.purchases;
    this.averageRating = data.averageRating;
    this.category = data.category;
    this.productImages = data.productImages;
  }
}
