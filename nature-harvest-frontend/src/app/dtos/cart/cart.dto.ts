export class CartDto {
  userId: string;
  productId: number;
  quantity: number;

  constructor(data: any) {
    this.userId = data.userId;
    this.productId = data.productId;
    this.quantity = data.quantity;
  }
}
