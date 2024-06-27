export class OrderDetailResponse {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  thumbnail: string;
  reviewed: boolean;

  constructor(
    productId: number,
    productName: string,
    quantity: number,
    price: number,
    thumbnail: string,
    reviewed: boolean
  ) {
    this.productId = productId;
    this.productName = productName;
    this.quantity = quantity;
    this.price = price;
    this.thumbnail = thumbnail;
    this.reviewed = reviewed;
  }
}
