export class CouponResponse {
  id: number;
  code: string;
  discountType: string;
  description: string;
  attribute: string;
  operator: string;
  value: string;
  discountAmount: number;
  startDate: string;
  endDate: string;

  constructor(
    id: number,
    code: string,
    discountType: string,
    description: string,
    attribute: string,
    operator: string,
    value: string,
    discountAmount: number,
    startDate: string,
    endDate: string
  ) {
    this.id = id;
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
