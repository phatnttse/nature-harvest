import { OrderDetailResponse } from './order-detail.response';
import { OrderResponse } from './order.response';

export class OrderAndOrderDetailsResponse {
  order: OrderResponse;
  orderDetails: OrderDetailResponse[];

  constructor(data: any) {
    this.order = data.order;
    this.orderDetails = data.orderDetails;
  }
}
