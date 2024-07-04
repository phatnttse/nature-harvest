export class SignUpDto {
  name: string;
  email: string;
  password: string;

  constructor(data: any) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }
}
