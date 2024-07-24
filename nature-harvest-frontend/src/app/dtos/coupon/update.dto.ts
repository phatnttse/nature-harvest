export class UpdateCouponDto {
  code: string;
  description: string;
  value: string;
  discountAmount: number;
  startDate: string;
  endDate: string;

  constructor(
    code: string,
    description: string,
    value: string,
    discountAmount: number,
    startDate: string,
    endDate: string
  ) {
    this.code = code;
    this.description = description;
    this.value = value;
    this.discountAmount = discountAmount;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
