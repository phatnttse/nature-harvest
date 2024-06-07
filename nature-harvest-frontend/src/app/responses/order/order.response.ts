export class OrderResponse {
  id: string;
  userId: string;
  email: string;
  name: string;
  phone: string;
  deliveryAddress: string;
  note: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: Date;
  deliveryDate: Date;
  amount: number;

  constructor(
    id: string,
    userId: string,
    email: string,
    name: string,
    phone: string,
    deliveryAddress: string,
    note: string,
    status: string,
    paymentStatus: string,
    paymentMethod: string,
    orderDate: Date,
    deliveryDate: Date,
    amount: number
  ) {
    this.id = id;
    this.userId = userId;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.deliveryAddress = deliveryAddress;
    this.note = note;
    this.status = status;
    this.paymentStatus = paymentStatus;
    this.paymentMethod = paymentMethod;
    this.orderDate = orderDate;
    this.deliveryDate = deliveryDate;
    this.amount = amount;
  }
}
