export class RemoveCartDto {
  userId: string;
  productId: number;

  constructor(data: any) {
    this.userId = data.userId;
    this.productId = data.productId;
  }
}
