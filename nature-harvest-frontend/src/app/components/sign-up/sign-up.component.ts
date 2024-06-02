import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
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
import { RouterModule } from '@angular/router';

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

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  signUp() {
    debugger;
    if (
      this.emailFormControl.valid &&
      this.nameFormControl.valid &&
      this.passwordFormControl.valid &&
      this.confirmPasswordFormControl.valid
    ) {
      const signUpDto: SignUpDto = {
        name: this.nameFormControl.value!,
        email: this.emailFormControl.value!,
        password: this.passwordFormControl.value!,
        confirmPassword: this.confirmPasswordFormControl.value!,
      };
      this.userService.signUp(signUpDto).subscribe({
        next: (response: SignUpResponse) => {
          debugger;
          this.toastr.success(response.message, 'Signup Success', {
            closeButton: true,
            timeOut: 2000,
            easeTime: 500,
            positionClass: 'toast-top-right',
            progressBar: true,
          });
        },
        error: (error: any) => {
          this.toastr.show(error?.error?.message, 'Signup Fail', {
            closeButton: true,
            timeOut: 2000,
            easeTime: 600,
          });
        },
      });
    } else {
      this.toastr.error('Fields invalid', 'Signup Fail', {
        closeButton: true,
        timeOut: 2000,
        easeTime: 600,
      });
    }
  }
}
