export class OrderDetailResponse {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  thumbnail: string;

  constructor(
    productId: number,
    productName: string,
    quantity: number,
    price: number,
    thumbnail: string
  ) {
    this.productId = productId;
    this.productName = productName;
    this.quantity = quantity;
    this.price = price;
    this.thumbnail = thumbnail;
  }
}
