import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { LoginResponse } from '../../responses/user/login.response';
import { HttpErrorResponse } from '@angular/common/http';
import { UserResponse } from '../../responses/user/user.response';
import { TokenService } from '../../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { ForgotPasswordDto } from '../../dtos/user/forgot-password.dto';
import { BaseResponse } from '../../responses/base/base.response';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './../../../assets/css/styles.css',
    './../../../assets/css/app.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  userResponse?: UserResponse;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    const forgotPasswordDto: ForgotPasswordDto = {
      email: this.forgotPasswordForm.value.email,
    };
    debugger;
    this.userService.forgotPassword(forgotPasswordDto).subscribe({
      next: (response: BaseResponse) => {
        debugger;
        if (response.status === 200) {
          this.toastr.success(
            'Vui lòng kiểm tra trong hộp thư để nhận mật khẩu mới',
            '',
            {
              timeOut: 5000,
              progressBar: true,
            }
          );
        } else {
          this.toastr.error(response.message, 'Thất bại', {
            timeOut: 3000,
            progressBar: true,
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message, 'Thất bại', {
          timeOut: 3000,
          progressBar: true,
        });
      },
    });
  }

  async handleLoginGoogle() {
    this.authService
      .loginWithGoogle()
      .then((response) => {
        const user = response.user;
        user.getIdToken().then(async (token) => {
          await this.loginGoogle(token);
        });
      })
      .catch((error) => {
        console.error('Error during Google login:', error);
      });
  }

  loginGoogle(googleToken: string) {
    this.userService.loginGoogle(googleToken).subscribe({
      next: (response: LoginResponse) => {
        const { token } = response;
        this.tokenService.setToken(token);
        this.userService.getUserDetails(token).subscribe({
          next: (resp: UserResponse) => {
            this.userResponse = {
              ...resp,
              dateOfBirth: new Date(resp.dateOfBirth) || null,
            };
            this.userService.setUserResponse(this.userResponse!);
            this.router.navigate(['']);
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }
}
