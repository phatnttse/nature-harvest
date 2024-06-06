import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
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
import { UserService } from '../../services/user.service';
import { LoginDto } from '../../dtos/user/login.dto';
import { LoginResponse } from '../../responses/user/login.response';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { MatIconModule } from '@angular/material/icon';

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
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('phat19102003@gmail.com', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('123', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  userResponse?: UserResponse;
  hide = true;
  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
    private platformLocation: PlatformLocation
  ) {}

  ngOnInit(): void {
    if (this.platformLocation instanceof BrowserPlatformLocation) {
      // Chỉ chạy mã khi ở trong trình duyệt web
      google.accounts.id.initialize({
        client_id:
          '487241989850-scg65bilo6v0ot63d51dipqlj0ei9k06.apps.googleusercontent.com',
        callback: (response: any) => {
          debugger;
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
  }

  login() {
    debugger;
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      const loginDto: LoginDto = {
        email: this.emailFormControl.value!,
        password: this.passwordFormControl.value!,
      };

      this.userService.login(loginDto).subscribe({
        next: (response: LoginResponse) => {
          const { token } = response;
          this.tokenService.setToken(token);
          debugger;
          this.userService.getUserDetails(token).subscribe({
            next: (resp: UserResponse) => {
              debugger;
              this.userResponse = {
                ...resp,
                dateOfBirth: new Date(resp.dateOfBirth),
              };
              this.userService.setUserResponse(this.userResponse!);
            },
            complete: () => {
              debugger;
            },
            error: (error: any) => {
              console.log(error?.error?.message);
            },
          });

          this.router.navigate(['']);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          this.toastr.warning(`${error?.error?.message}`, 'Login Fail', {
            closeButton: true,
            timeOut: 2000,
            easeTime: 500,
            positionClass: 'toast-top-right',
            progressBar: true,
          });
        },
      });
    } else {
      this.toastr.warning('Email and password is required', 'Warning', {
        closeButton: true,
        timeOut: 2000,
        easeTime: 500,
        positionClass: 'toast-top-right',
        progressBar: true,
      });
    }
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
            this.toastr.warning(`${error?.error?.message}`, 'Login Fail', {
              closeButton: true,
              timeOut: 2000,
              easeTime: 500,
              positionClass: 'toast-top-right',
              progressBar: true,
            });
          },
        });
      },
      error: (error: any) => {
        this.toastr.warning(`${error?.error?.message}`, 'Login Fail', {
          closeButton: true,
          timeOut: 2000,
          easeTime: 500,
          positionClass: 'toast-top-right',
          progressBar: true,
        });
      },
    });
  }
}
