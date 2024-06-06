import { CartResponse } from './cart.response';

export class CartListResponse {
  cart: CartResponse[];

  constructor(data: any) {
    this.cart = data.cart;
  }
}
