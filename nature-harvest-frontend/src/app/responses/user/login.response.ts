export class LoginResponse {
  message: string;
  token: string;
  refreshToken: string;
  tokenType: string;
  //user's detail
  id: string;
  username: string;
  role: string[];

  constructor(data: any) {
    this.message = data.message;
    this.token = data.token;
    this.refreshToken = data.refreshToken;
    this.tokenType = data.tokenType;
    this.id = data.id;
    this.username = data.username;
    this.role = data.role;
  }
}
