export class ProductResponse {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  quantity: number;
  discount: number;
  purchases: number;
  averageRating: number;
  categoryId: number;
  // subCategoryId: number;
  totalPages: number;

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
    this.categoryId = data.categoryId;
    // this.subCategoryId = data.subCategoryId;
    this.totalPages = data.totalPages;
  }
}
