import { UpdatePictureDto } from './../../dtos/user/update-picture.dto';
import { UpdateUserProfileDto } from './../../dtos/user/update.dto';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserResponse } from '../../responses/user/user.response';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ScriptService } from '../../services/script.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CLOUDINARY } from '../../environments/environment.development';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangePasswordComponent } from '../dialog/change-password/change-password.component';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./../order/order.component.scss'],
  imports: [
    RouterModule,
    FooterComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    HeaderComponent,
    BreadcrumbComponent,
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userResponse?: UserResponse | null;
  profileForm: FormGroup;
  showDropzonePopup = false;
  subscriptions: Subscription[] = [];
  uploadedImage = '';
  uploadedImages: string[] = [];
  isDisabled = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private scriptService: ScriptService,
    private dialog: MatDialog,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.minLength(10)]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      dateOfBirth: [''],
    });
    this.scriptService.load('uw');
  }

  ngOnInit(): void {
    const subscription = this.userService.userResponse$.subscribe(
      (userResponse) => {
        this.userResponse = userResponse;
        if (this.userResponse) {
          debugger;
          this.profileForm.patchValue(this.userResponse);
        }
      }
    );
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  processResults = (error: any, result: any): void => {
    if (result.event === 'close') {
      this.isDisabled = false;
    }
    if (result && result.event === 'success') {
      const secureUrl = result.info.secure_url;
      const previewUrl = secureUrl.replace('/upload/', '/upload/w_110/');
      this.uploadedImages.push(previewUrl);
      const updatePictureDto: UpdatePictureDto = {
        pictureUrl: secureUrl,
      };
      this.userService.updatePicture(updatePictureDto).subscribe({
        next: (response: UserResponse) => {
          this.userService.setUserResponse(response);
          this.isDisabled = false;
          this.toastr.success('Cập nhật hình ảnh thành công');
        },
        error: (err: any) => {
          console.log(err);
          this.toastr.error(`Cập nhật ảnh không thành công`);
        },
      });
    }
    if (error) {
      this.isDisabled = false;
    }
  };

  uploadWidget = (): void => {
    this.isDisabled = true;
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUDINARY.cloudName,
        uploadPreset: CLOUDINARY.uploadPreset,
        sources: ['local', 'url'],
        tags: ['myphotoalbum-nature-harvest'],
        clientAllowedFormats: ['image'],
        resourceType: 'image',
        maxFileSize: 2 * 1024 * 1024,
        multiple: false,
      },
      this.processResults
    );
  };

  saveChanges() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const formValue = this.profileForm.value;
    let dateOfBirth = formValue.dateOfBirth;

    // Kiểm tra và chuyển đổi nếu cần thiết
    if (dateOfBirth && !(dateOfBirth instanceof Date)) {
      dateOfBirth = new Date(dateOfBirth);
    }

    if (dateOfBirth) {
      dateOfBirth = new Date(
        Date.UTC(
          dateOfBirth.getFullYear(),
          dateOfBirth.getMonth(),
          dateOfBirth.getDate()
        )
      );
    }
    const updateUserProfileDto: UpdateUserProfileDto = {
      ...this.profileForm.value,
      dateOfBirth: dateOfBirth,
    };
    debugger;
    this.userService
      .updateProfile(this.userResponse?.id!, updateUserProfileDto)
      .subscribe({
        next: (response: UserResponse) => {
          this.userResponse = {
            ...response,
            dateOfBirth: new Date(response.dateOfBirth),
          };
          this.userService.setUserResponse(this.userResponse);
          this.toastr.success(`Cập nhật thông tin thành công`, '', {
            closeButton: true,
            timeOut: 3000,
            progressBar: true,
          });
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.toastr.error(`Cập nhật thông tin không thành công`);
        },
      });
  }
  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '500px',
      position: { top: '180px' },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.router.navigate(['/login']);
        this.toastr.success('Đổi mật khẩu thành công');
      }
    });
  }
  logOut() {
    this.userService.clearUserResponse();
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
