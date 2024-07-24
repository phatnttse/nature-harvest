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
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CLOUDINARY } from '../../../../environments/environment.development';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';
import { BlogService } from '../../../../services/blog.service';
import { BlogDto } from '../../../../dtos/blog/blog.dto';
import { BlogResponse } from '../../../../responses/blog/blog.response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
  ],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.scss',
})
export class CreateBlogComponent {
  blogForm: FormGroup;
  uploadedImage = '';
  uploadedImages: string[] = [];
  isPictureError: boolean = false;
  isDisabled: boolean = false;
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '30rem',
    minHeight: '10rem',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private blogService: BlogService
  ) {
    this.blogForm = this.formBuilder.group({
      title: [
        '',
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(50),
      ],
      content: ['', Validators.required, Validators.minLength(300)],
      tags: ['', Validators.required],
      summary: ['', Validators.required, Validators.minLength(20)],
    });
  }

  onSubmit() {
    if (this.uploadedImages.length === 0) {
      this.isPictureError = true;
      return;
    }

    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }
    const blogDto: BlogDto = {
      title: this.blogForm.value.title,
      content: this.blogForm.get('content')?.value,
      summary: this.blogForm.get('summary')?.value,
      tags: this.blogForm.value.tags,
      thumbnail: this.uploadedImages[0],
    };
    debugger;
    this.blogService.createBlog(blogDto).subscribe({
      next: (response: BlogResponse) => {
        debugger;
        this.router.navigate(['/admin/blogs']);
        this.toastr.success('Đăng bài viết thành công');
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message, 'Đăng bài viết thất bại');
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
      this.isPictureError = false;
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
