export class CartDto {
  cartId: number | null;
  userId: string;
  productId: number;
  quantity: number;

  constructor(data: any) {
    this.cartId = data.cartId;
    this.userId = data.userId;
    this.productId = data.productId;
    this.quantity = data.quantity;
  }
}
