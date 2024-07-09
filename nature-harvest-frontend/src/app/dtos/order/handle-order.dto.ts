export class HandleOrderDto {
  orderId: string;
  status: string;

  constructor(data: any) {
    this.orderId = data.orderId;
    this.status = data.status;
  }
}
