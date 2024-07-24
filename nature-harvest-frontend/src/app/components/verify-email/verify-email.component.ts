import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BaseResponse } from '../../responses/base/base.response';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterModule, MatProgressSpinnerModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  verified: boolean = false;
  isErrored: boolean = false;
  message: string = '';
  email: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const token = this.activatedRoute.snapshot.paramMap.get('token');
    if (token) {
      this.verifyEmail(token);
    }
    const email = this.activatedRoute.snapshot.paramMap.get('email');
    if (email) {
      this.email = email;
    }
  }

  verifyEmail(token: string) {
    this.userService.verifyEmail(token).subscribe({
      next: (response: BaseResponse) => {
        if (response.status === 200) {
          this.verified = true;
        } else if (response.status === 401 || response.status === 400) {
          this.isErrored = true;
          this.message = response.message;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
  resendVerificationEmail() {
    this.userService.resendVerificationEmail(this.email).subscribe({
      next: (response: BaseResponse) => {
        if (response.status === 200) {
          this.isErrored = false;
          this.toastr.success(
            'Gửi lại email xác thực thành công',
            'Thành công'
          );
        } else if (response.status === 400) {
          this.toastr.error(
            response.message,
            'Gửi lại email xác thực thất bại'
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
}
