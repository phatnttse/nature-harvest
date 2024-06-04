export class ProductImage {
  id: string;
  productId: number;
  imageUrl: string;

  constructor(data: any) {
    this.id = data.id;
    this.productId = data.productId;
    this.imageUrl = data.imageUrl;
  }
}
