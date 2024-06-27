export class CommentDto {
  productId: number;
  orderId: string;
  content: string;
  starRating: number;
  picture: string | null;

  constructor(data: any) {
    this.productId = data.productId;
    this.orderId = data.orderId;
    this.content = data.content;
    this.starRating = data.starRating;
    this.picture = data.picture;
  }
}
