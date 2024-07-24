export class CouponCalculationResponse {
  discountAmount: number;
  status: number;
  message: string;

  constructor(data: any) {
    this.discountAmount = data.discountAmount;
    this.status = data.status;
    this.message = data.message;
  }
}
