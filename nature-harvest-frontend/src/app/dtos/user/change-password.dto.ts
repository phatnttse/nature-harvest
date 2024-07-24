export class ChangePasswordDto {
  currentPassword: string;
  newPassword: string;

  constructor(data: any) {
    this.currentPassword = data.currentPassword;
    this.newPassword = data.newPassword;
  }
}
