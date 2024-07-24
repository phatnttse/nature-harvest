import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import {
  BrowserPlatformLocation,
  CommonModule,
  PlatformLocation,
} from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SignUpDto } from '../../dtos/user/signup.dto';
import { ToastrService } from 'ngx-toastr';
import { ErrorStateMatcher } from '@angular/material/core';
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
import { GOOGLE } from '../../environments/environment.development';
declare var google: any;

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
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  userResponse?: UserResponse;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private platformLocation: PlatformLocation,
    private tokenService: TokenService,
    private formBuilder: FormBuilder
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

  ngOnInit(): void {
    if (this.platformLocation instanceof BrowserPlatformLocation) {
      google.accounts.id.initialize({
        client_id: GOOGLE.clientId,
        callback: (response: any) => {
          this.loginGoogle(response.credential);
        },
      });

      google.accounts.id.renderButton(document.getElementById('google-btn2'), {
        theme: 'filled_blue',
        size: 'large',
        shape: 'rectangular',
        with: '350',
        logo_alignment: 'center',
      });
    }
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
