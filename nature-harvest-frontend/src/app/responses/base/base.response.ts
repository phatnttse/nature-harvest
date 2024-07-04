export class BaseResponse {
  message: string;
  status: number;

  constructor(data: any) {
    this.message = data.message;
    this.status = data.status;
  }
}
