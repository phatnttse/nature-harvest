import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm : FormGroup;

  constructor(
    private formBuider: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private toastr: ToastrService
  ){
    this.changePasswordForm = this.formBuider.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]],
      confirmPassword: ['',[
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]],
    }, {validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup){
    return formGroup.get('newPassword')?.value === formGroup.get('confirmPassword')?.value
    ? null : { mismatch: true };
  }

  

  onSubmit(){
    if (this.changePasswordForm.valid) {
      const changePasswordDto = {
        currentPassword: this.changePasswordForm.get('currentPassword')?.value,
        newPassword: this.changePasswordForm.get('newPassword')?.value
      };

      this.userService.changePassword(changePasswordDto).subscribe({
        next: () => {
          this.toastr.success('Thay đổi mật khẩu thành công');
          this.dialogRef.close();
        },
        error: (error) => {
          this.toastr.error('Đã xảy ra lỗi. Vui lòng thử lại');
        }
      });
    } else {
      this.showValidationErrors();
      this.changePasswordForm.markAllAsTouched();  // Đánh dấu tất cả các control là "touched" để hiển thị lỗi
    }
  }

  showValidationErrors() {
    if (this.currentPassword?.hasError('required')) {
      this.toastr.error('Mật khẩu hiện tại không được để trống');
    }

    if (this.newPassword?.hasError('required')) {
      this.toastr.error('Mật khẩu mới không được để trống');
    } else {
      if (this.newPassword?.hasError('minlength')) {
        this.toastr.error('Mật khẩu mới phải có ít nhất 8 ký tự');
      }
      if (this.newPassword?.hasError('pattern')) {
        this.toastr.error('Mật khẩu mới phải bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt');
      }
    }

    if (this.confirmPassword?.hasError('required')) {
      this.toastr.error('Xác nhận mật khẩu không được để trống');
    } else {
      if (this.confirmPassword?.hasError('minlength')) {
        this.toastr.error('Xác nhận mật khẩu mới phải có ít nhất 8 ký tự');
      }
      if (this.confirmPassword?.hasError('pattern')) {
        this.toastr.error('Xác nhận mật khẩu mới phải bao gồm ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ số và một ký tự đặc biệt');
      }
      if (this.newPassword?.hasError('sameAsCurrentPassword')) {
        this.toastr.error('Mật khẩu mới không được trùng với mật khẩu hiện tại');
      }
    }

    if (this.changePasswordForm.hasError('mismatch')) {
      this.toastr.error('Mật khẩu mới và xác nhận mật khẩu mới không khớp');
    }
  }


    get currentPassword() {
      return this.changePasswordForm.get('currentPassword');
    }

    get newPassword() {
      return this.changePasswordForm.get('newPassword');
    }

    get confirmPassword() {
     return this.changePasswordForm.get('confirmPassword');
  }
  }

