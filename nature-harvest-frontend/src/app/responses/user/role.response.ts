export class Role {
  id: number;
  name: string;
  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
  }
}
export const ROLE_USER = 'USER';
export const ROLE_ADMIN = 'ADMIN';
