import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CLOUDINARY } from '../../../../environments/environment.development';
import { BaseResponse } from '../../../../responses/base/base.response';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SubCategoryResponse } from '../../../../responses/subcategory/subcategory.response';
import { CategoryDto } from '../../../../dtos/category/category.dto';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { CategoryResponse } from '../../../../responses/category/category.response';
import { CreateSubcategoryComponent } from '../create-subcategory/create-subcategory.component';
import { EditSubcategoryComponent } from '../edit-subcategory/edit-subcategory.component';
import { DeleteSubcategoryComponent } from '../delete-subcategory/delete-subcategory.component';

@Component({
  selector: 'app-edit-category',
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
    MatTableModule,
    RouterModule,
  ],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss',
})
export class EditCategoryComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  categoryForm: FormGroup;
  uploadedImage = '';
  uploadedImages: string[] = [];
  isDisabled: boolean = false;
  isPictureError: boolean = false;
  dataSource = new MatTableDataSource<SubCategoryResponse>();
  displayedColumns: string[] = ['name', 'action'];
  category: CategoryResponse | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    if (slug) {
      this.findSubcategoryBySlug(slug);
    }
  }

  private findSubcategoryBySlug(slug: string): void {
    let found = false;
    this.categoryService.categoriesWithSubcategories$.forEach((categories) => {
      if (!found) {
        categories.forEach((category) => {
          if (category.slug === slug) {
            this.categoryForm.patchValue({
              name: category.name,
            });
            this.dataSource.data = category.subcategories;
            this.category = category;
            found = true;
          }
        });
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSubmit() {
    if (this.categoryForm.invalid || this.uploadedImages.length <= 0) {
      this.categoryForm.markAllAsTouched();
      this.isPictureError = true;
      return;
    }
    const categoryDto: CategoryDto = {
      ...this.categoryForm.value,
      thumbnail: this.uploadedImages[0],
    };
    this.categoryService
      .updateCategory(this.category?.id!, categoryDto)
      .subscribe({
        next: (response: BaseResponse) => {
          if (response.status === 200) {
            this.router.navigate(['/admin/categories']);
            this.categoryService.getCategoriesWithSubcategories().subscribe();
            this.toastr.success('Cập nhật danh mục thành công');
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.toastr.error('Cập nhật danh mục thất bại');
        },
      });
  }
  openCreateSubcategoryDialog() {
    debugger;
    const dialogRef = this.dialog.open(CreateSubcategoryComponent, {
      width: '400px',
      data: this.category?.id,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      debugger;
      if (result) {
        this.toastr.success('Tạo danh mục con mới thành công');
      }
    });
  }

  openUpdateSubcategoryDialog(subcategoryId: number) {
    debugger;
    const dialogRef = this.dialog.open(EditSubcategoryComponent, {
      width: '400px',
      data: subcategoryId,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      debugger;
      if (result) {
        this.toastr.success('Cập nhật danh con mới thành công');
      }
    });
  }

  openDeleteSubcategoryDialog(subcategoryId: number) {
    debugger;
    const dialogRef = this.dialog.open(DeleteSubcategoryComponent, {
      width: '400px',
      data: subcategoryId,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      debugger;
      if (result) {
        this.toastr.success('Xoá danh mục con thành công');
      }
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
