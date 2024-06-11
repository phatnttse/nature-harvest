import { OrderDto } from '../order/order.dto';

export class VnPayPaymentDto {
  bankCode: string;
  language: string;
  order: OrderDto;

  constructor(data: any) {
    this.bankCode = data.bankCode;
    this.language = data.language;
    this.order = data.order;
  }
}
