import { UpdatePictureDto } from './../../dtos/user/update-picture.dto';
import { UpdateUserProfileDto } from './../../dtos/user/update.dto';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { MatDialogModule } from '@angular/material/dialog';
import { CLOUDINARY } from '../../environments/environment.development';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './../order/order.component.scss',
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
  ],
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
    private scriptService: ScriptService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.minLength(10)]],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      dateOfBirth: [Date.now()],
    });
    this.scriptService.load('uw');
  }

  ngOnInit(): void {
    const subscription = this.userService.userResponse$.subscribe(
      (userResponse) => {
        this.userResponse = userResponse;
        if (this.userResponse) {
          this.profileForm.patchValue({
            name: this.userResponse.name || '',
            address: this.userResponse.address || '',
            phone: this.userResponse.phone || '',
            dateOfBirth: this.userResponse.dateOfBirth || Date.now(),
          });
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
        maxFileSize: 5 * 1024 * 1024,
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
    const updateUserProfileDto: UpdateUserProfileDto = {
      ...this.profileForm.value,
    };
    debugger;
    this.userService
      .updateProfile(this.userResponse?.id!, updateUserProfileDto)
      .subscribe({
        next: (response: UserResponse) => {
          this.userService.setUserResponse(response);
          this.toastr.success(`Cập nhật thông tin thành công`, '', {
            closeButton: true,
            timeOut: 3000,
            progressBar: true,
          });
        },
        error: (err: any) => {
          console.log(err);
          this.toastr.error(`Cập nhật thông tin không thành công`);
        },
      });
  }
}
