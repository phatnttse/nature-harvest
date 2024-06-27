import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserService } from '../../services/user.service';
import {
  BrowserPlatformLocation,
  CommonModule,
  PlatformLocation,
} from '@angular/common';
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SignUpDto } from '../../dtos/user/signup.dto';
import { ToastrService } from 'ngx-toastr';
import { SignUpResponse } from '../../responses/user/signup-response';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserResponse } from '../../responses/user/user.response';
import { LoginResponse } from '../../responses/user/login.response';
import { TokenService } from '../../services/token.service';
import { filter } from 'rxjs';
declare var google: any;

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
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
  ],
})
// implements OnInit, AfterViewInit, OnDestroy
export class SignUpComponent {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(50),
  ]);
  passwordFormControl = new FormControl('', [Validators.required]);
  confirmPasswordFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  userResponse?: UserResponse;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private platformLocation: PlatformLocation,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Khởi tạo lại các thành phần tại đây
        // Ví dụ: gọi lại hàm khởi tạo nút đăng nhập Google
        this.initializeGoogleSignIn();
      });
    if (this.platformLocation instanceof BrowserPlatformLocation) {
      // Chỉ chạy mã khi ở trong trình duyệt web
      google.accounts.id.initialize({
        client_id:
          '719610777931-akg597p377ho29jabqje6749hegpvhfd.apps.googleusercontent.com',
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
  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id:
        '719610777931-akg597p377ho29jabqje6749hegpvhfd.apps.googleusercontent.com',
      callback: (response: any) => {
        this.loginGoogle(response.credential);
      },
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangular',
      with: '350',
      logo_alignment: 'left',
    });
  }

  signUp() {
    if (
      this.emailFormControl.invalid ||
      this.nameFormControl.invalid ||
      (this.passwordFormControl.invalid &&
        this.confirmPasswordFormControl.invalid)
    ) {
      return;
    }

    debugger;
    const signUpDto: SignUpDto = {
      name: this.nameFormControl.value!,
      email: this.emailFormControl.value!,
      password: this.passwordFormControl.value!,
      confirmPassword: this.confirmPasswordFormControl.value!,
    };
    this.userService.signUp(signUpDto).subscribe({
      next: (response: SignUpResponse) => {
        debugger;
        this.router.navigate(['/verify-email']);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  loginGoogle(googleToken: string) {
    debugger;
    this.userService.loginGoogle(googleToken).subscribe({
      next: (response: LoginResponse) => {
        debugger;
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
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.error(error);
          },
        });
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
}
