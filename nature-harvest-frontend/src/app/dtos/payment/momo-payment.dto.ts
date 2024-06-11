import { OrderDto } from '../order/order.dto';

export class MoMoPaymentDto {
  requestType: string;
  lang: string;
  order: OrderDto;

  constructor(data: any) {
    this.requestType = data.requestType;
    this.lang = data.lang;
    this.order = data.order;
  }
}
