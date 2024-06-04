import { ProductResponse } from '../product/product.response';

export class CartResponse {
  cartId: number;
  userId: string;
  product: ProductResponse;
  quantity: number;

  constructor(data: any) {
    this.cartId = data.cartId;
    this.userId = data.userId;
    this.product = data.product;
    this.quantity = data.quantity;
  }
}
