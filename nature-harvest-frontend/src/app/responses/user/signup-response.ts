export class SignUpResponse {
  message: string;

  constructor(data: any) {
    this.message = data.message;
  }
}
