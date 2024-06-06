export class CartSizeResponse {
  cartSize: number;

  constructor(data: any) {
    this.cartSize = data.cartSize;
  }
}
