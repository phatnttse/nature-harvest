export class UpdateUserProfileDto {
  name: string;
  phone: string;
  address: string;
  dateOfBirth: Date;

  constructor(data: any) {
    this.name = data.name;
    this.phone = data.phone;
    this.address = data.address;
    this.dateOfBirth = data.dateOfBirth;
  }
}
