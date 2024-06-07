import { CartDto } from '../cart/cart.dto';

export class OrderDto {
  userId: string;
  email: string;
  name: string;
  phone: string;
  deliveryAddress: string;
  note: string;
  paymentMethod: string;
  amount: number;
  cartItems: CartDto[];

  constructor(data: any) {
    this.userId = data.userId;
    this.email = data.email;
    this.name = data.name;
    this.phone = data.phone;
    this.deliveryAddress = data.deliveryAddress;
    this.note = data.note;
    this.paymentMethod = data.paymentMethod;
    this.amount = data.amount;
    this.cartItems = data.cartItems;
  }
}
