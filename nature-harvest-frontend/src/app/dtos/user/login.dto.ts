export class LoginDto {
  email: string;
  password: string;

  constructor(data: any) {
    this.email = data.email;
    this.password = data.password;
  }
}
