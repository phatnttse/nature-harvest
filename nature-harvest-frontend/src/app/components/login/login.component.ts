import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoginDto } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../responses/user/login.response';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { MatIconModule } from '@angular/material/icon';
import { ROLE_ADMIN, ROLE_USER } from '../../responses/user/role.response';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: [
    './../../../assets/css/styles.css',
    './../../../assets/css/app.css',
  ],
  encapsulation: ViewEncapsulation.None,
  imports: [
    HeaderComponent,
    FooterComponent,
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
export class LoginComponent {
  loginForm: FormGroup;
  userResponse?: UserResponse;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
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

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginDto: LoginDto = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.userService.login(loginDto).subscribe({
      next: (response: LoginResponse) => {
        const { token } = response;
        this.tokenService.setToken(token);
        this.userService.getUserDetails(token).subscribe({
          next: (resp: UserResponse) => {
            this.userResponse = {
              ...resp,
              dateOfBirth: new Date(resp.dateOfBirth),
            };
            this.userService.setUserResponse(this.userResponse!);
            if (this.userResponse?.role.name === ROLE_USER) {
              this.router.navigate(['/']);
            } else if (this.userResponse?.role.name === ROLE_ADMIN) {
              this.router.navigate(['/admin']);
            }
          },
          error: (error: any) => {
            console.log(error?.error?.message);
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.warning(error.error.message, 'Đăng nhập không thành công', {
          closeButton: true,
          timeOut: 3000,
          progressBar: true,
        });
      },
    });
  }

  async loginGoogle(googleToken: string) {
    this.userService.loginGoogle(googleToken).subscribe({
      next: (response: LoginResponse) => {
        const { token } = response;
        this.tokenService.setToken(token);
        this.userService.getUserDetails(token).subscribe({
          next: (resp: UserResponse) => {
            debugger;
            this.userResponse = {
              ...resp,
              dateOfBirth: new Date(resp.dateOfBirth) || null,
            };
            this.userService.setUserResponse(this.userResponse!);
            if (this.userResponse?.role.name === ROLE_USER) {
              this.router.navigate(['/']);
            } else if (this.userResponse?.role.name === ROLE_ADMIN) {
              this.router.navigate(['/admin']);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.toastr.warning(
              error.error.message,
              'Đăng nhập không thành công',
              {
                closeButton: true,
                timeOut: 3000,
                progressBar: true,
              }
            );
            console.log(error);
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.warning(error.error.message, 'Đăng nhập không thành công', {
          closeButton: true,
          timeOut: 3000,
          progressBar: true,
        });
        console.log(error);
      },
    });
  }
}
