import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { CategoryService } from '../../../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CLOUDINARY } from '../../../../environments/environment.development';
import { BaseResponse } from '../../../../responses/base/base.response';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryDto } from '../../../../dtos/category/category.dto';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss',
})
export class CreateCategoryComponent {
  categoryForm: FormGroup;
  uploadedImage = '';
  uploadedImages: string[] = [];
  isDisabled: boolean = false;
  isPictureError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    debugger;
    if (this.categoryForm.invalid || this.uploadedImages.length <= 0) {
      this.categoryForm.markAllAsTouched();
      this.isPictureError = true;
      return;
    }
    const categoryDto: CategoryDto = {
      ...this.categoryForm.value,
      thumbnail: this.uploadedImages[0],
    };
    this.categoryService.createCategory(categoryDto).subscribe({
      next: (response: BaseResponse) => {
        debugger;
        if (response.status === 200) {
          this.router.navigate(['/admin/categories']);
          this.categoryService.getCategoriesWithSubcategories().subscribe();
          this.toastr.success('Tạo danh mục mới thành công');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toastr.error('Tạo danh mục thất bại');
      },
    });
  }

  processResults = (error: any, result: any): void => {
    if (result.event === 'close') {
      this.isDisabled = false;
    }
    if (result && result.event === 'success') {
      const secureUrl = result.info.secure_url;
      const previewUrl = secureUrl.replace('/upload/', '/upload/w_600/');
      this.uploadedImages.push(previewUrl);
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
}
