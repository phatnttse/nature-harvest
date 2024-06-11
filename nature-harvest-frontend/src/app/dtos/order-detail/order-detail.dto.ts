export class OrderDetailDto {
  orderId: string;

  constructor(data: any) {
    this.orderId = data.orderId;
  }
}
