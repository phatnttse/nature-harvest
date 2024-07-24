import { OrderAndOrderDetailsResponse } from './order-orderdetails-response';

export class OrderTrackingResponse {
  orders: OrderAndOrderDetailsResponse[];
  totalPages: number;
  totalPending: number;
  totalConfirmed: number;
  totalPickedUp: number;
  totalOnTheWay: number;
  totalSuccessDelivery: number;
  totalRefused: number;
  totalCanceled: number;
  constructor(data: any) {
    this.orders = data.orders;
    this.totalPages = data.totalPages;
    this.totalPending = data.totalPending;
    this.totalConfirmed = data.totalConfirmed;
    this.totalPickedUp = data.totalPickedUp;
    this.totalOnTheWay = data.totalOnTheWay;
    this.totalSuccessDelivery = data.totalSuccessDelivery;
    this.totalRefused = data.totalRefused;
    this.totalCanceled = data.totalCanceled;
  }
}
