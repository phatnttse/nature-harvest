export class CommentDto {
  productId: number;
  orderId: string;
  content: string;
  starRating: number;
  pictures: string[] | [];

  constructor(data: any) {
    this.productId = data.productId;
    this.orderId = data.orderId;
    this.content = data.content;
    this.starRating = data.starRating;
    this.pictures = data.pictures;
  }
}
