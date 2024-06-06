import { ProductResponse } from '../product/product.response';

export class CartResponse {
  id: number;
  userId: string;
  product: ProductResponse;
  quantity: number;

  constructor(data: any) {
    this.id = data.id;
    this.userId = data.userId;
    this.product = data.product;
    this.quantity = data.quantity;
  }
}
