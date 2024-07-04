export class CreateProductDto {
  title: string;
  price: number;
  description: string;
  quantity: number;
  discount: number;
  images: string[];
  categoryId: number;
  subcategoryId: number;

  constructor(data: any) {
    this.title = data.title;
    this.price = data.price;
    this.description = data.description;
    this.quantity = data.quantity;
    this.discount = data.discount;
    this.images = data.images;
    this.categoryId = data.categoryId;
    this.subcategoryId = data.subcategoryId;
  }
}
