export class UpdateOrderDto {
  userId: string;
  name: string;
  phone: string;
  deliveryAddress: string;
  note: string;
  amount: number;

  constructor(data: any) {
    this.userId = data.userId;
    this.name = data.name;
    this.phone = data.phone;
    this.deliveryAddress = data.deliveryAddress;
    this.note = data.note;
    this.amount = data.amount;
  }
}
