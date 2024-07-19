import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
    forgotPasswordForm: FormGroup;

    constructor(
      private fb: FormBuilder,
      private userService: UserService,
      private toastr: ToastrService
    ){
      this.forgotPasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      });     
    }

    onSubmit(){
      if(this.forgotPasswordForm.invalid){
        return;
      }

      const email = this.forgotPasswordForm.value.email;
      this.userService.forgotPassword(email).subscribe(
        response => {
          this.toastr.success('Your required about creating new password was sent to your email address');
        },
        error => {
          this.toastr.error('We have an error! Please try it back');
        }
      )
    }
}
