import { Role } from './role.response';

export interface UserResponse {
  id: string;
  email: string;
  address: string;
  picture: string;
  name: string;
  phone: string;
  dateOfBirth: Date;
  role: Role;
}
