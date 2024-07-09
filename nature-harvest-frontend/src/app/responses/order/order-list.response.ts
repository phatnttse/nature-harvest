import { OrderResponse } from './order.response';

export class OrderListResponse {
  orders: OrderResponse[];
  totalPages: number;

  constructor(data: any) {
    this.orders = data.orders;
    this.totalPages = data.totalPages;
  }
}
