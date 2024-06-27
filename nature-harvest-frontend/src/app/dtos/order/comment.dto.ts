export class CommentDto {
  productId: number;
  orderId: string;
  content: string;
  starRating: number;

  constructor(data: any) {
    this.productId = data.productId;
    this.orderId = data.orderId;
    this.content = data.content;
    this.starRating = data.starRating;
  }
}
