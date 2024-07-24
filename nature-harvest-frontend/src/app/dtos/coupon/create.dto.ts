export class CreateCouponDto {
  code: string;
  discountType: string;
  description: string;
  attribute: string;
  operator: string;
  value: string;
  discountAmount: number;
  startDate: Date;
  endDate: Date;

  constructor(
    code: string,
    discountType: string,
    description: string,
    attribute: string,
    operator: string,
    value: string,
    discountAmount: number,
    startDate: Date,
    endDate: Date
  ) {
    this.code = code;
    this.discountType = discountType;
    this.description = description;
    this.attribute = attribute;
    this.operator = operator;
    this.value = value;
    this.discountAmount = discountAmount;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
