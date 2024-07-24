import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { UserService } from '../../../../services/user.service';
import { BaseResponse } from '../../../../responses/base/base.response';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss',
})
export class DeleteUserComponent {
  userId: string = '';
  block: number = 0;
  enable: number = 1;

  constructor(
    private dialogRef: MatDialogRef<DeleteUserComponent>,
    private userService: UserService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    this.userId = this.data;
  }

  deleteUser() {
    this.userService.deleteUser(this.userId, this.block).subscribe({
      next: (response: BaseResponse) => {
        debugger;
        if (response.status === 200) {
          this.dialogRef.close(true);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.error.message, 'Xoá người dùng thất bại');
        console.log(err);
      },
    });
  }
}
