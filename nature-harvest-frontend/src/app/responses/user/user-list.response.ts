import { UserResponse } from './user.response';

export class UserListResponse {
  users: UserResponse[];
  totalPages: number;

  constructor(data: any) {
    this.users = data.users;
    this.totalPages = data.totalPages;
  }
}
