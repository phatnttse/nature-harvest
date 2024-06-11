export class ClearCartDto {
  userId: string;

  constructor(data: any) {
    this.userId = data.userId;
  }
}
