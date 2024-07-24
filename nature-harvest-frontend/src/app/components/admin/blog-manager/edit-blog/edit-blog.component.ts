import { Component, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-edit-blog',
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
    ReactiveFormsModule,
    AngularEditorModule,
  ],
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.scss',
})
export class EditBlogComponent implements OnInit {
  blogForm: FormGroup;
  uploadedImage = '';
  uploadedImages: string[] = [];
  isPictureError: boolean = false;
  isDisabled: boolean = false;
  htmlContent = '';
  blog: BlogResponse | null = null;

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
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute
  ) {
    this.blogForm = this.formBuilder.group({
      title: [
        '',
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(50),
      ],
      content: ['', [Validators.required, Validators.minLength(300)]],
      tags: ['', [Validators.required]],
      summary: ['', [Validators.required, Validators.minLength(20)]],
    });
  }
  ngOnInit(): void {
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    if (slug)
      this.blogService.getBlogBySlug(slug).subscribe({
        next: (response: BlogResponse) => {
          debugger;
          this.blog = response;
          this.blogForm.patchValue({
            title: response.title,
            content: response.content,
            tags: response.tags,
            summary: response.summary,
          });
          this.uploadedImages.push(response.thumbnail);
          this.blogForm.markAsPristine();
          this.blogForm.markAsUntouched();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  saveChanges() {
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
      thumbnail: this.uploadedImages[0],
      tags: this.blogForm.value.tags,
    };
    this.blogService.updateBlog(blogDto, this.blog?.id!).subscribe(
      (response: BlogResponse) => {
        this.toastr.success('Cập nhât bài viết thành công');
        this.router.navigate(['/admin/blogs']);
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(error.error.message, 'Cập nhật bài viết thất bại');
      }
    );
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
