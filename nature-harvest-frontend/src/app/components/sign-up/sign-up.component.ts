import { Component, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SignUpDto } from '../../dtos/user/signup.dto';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UserResponse } from '../../responses/user/user.response';
import { LoginResponse } from '../../responses/user/login.response';
import { TokenService } from '../../services/token.service';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from '../../responses/base/base.response';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: [
    './../../../assets/css/styles.css',
    './../../../assets/css/app.css',
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
  ],
})
export class SignUpComponent {
  signupForm: FormGroup;
  userResponse?: UserResponse;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.signupForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
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

  signUp() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    const signUpDto: SignUpDto = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
    };
    this.userService.signUp(signUpDto).subscribe({
      next: (response: BaseResponse) => {
        if (response.status === 200) {
          this.router.navigate(['/verify-email']);
        } else {
          this.toastr.error(response.message, 'Đăng ký thất bại');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message, 'Đăng ký thất bại');
        console.log(error);
      },
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
