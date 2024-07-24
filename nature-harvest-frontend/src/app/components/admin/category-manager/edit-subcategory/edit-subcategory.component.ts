import { SubcategoryDto } from './../../../../dtos/category/subcategory.dto';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { CategoryService } from '../../../../services/category.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SubCategoryService } from '../../../../services/subcategory.service';
import { BaseResponse } from '../../../../responses/base/base.response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-subcategory',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './edit-subcategory.component.html',
  styleUrl: './edit-subcategory.component.scss',
})
export class EditSubcategoryComponent {
  subcategoryForm: FormGroup;
  subcategoryId: number = 0;
  categoryId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private subcategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<EditSubcategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subcategoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.subcategoryId = this.data;
    if (this.subcategoryId) {
      this.findSubcategoryBySlug(this.subcategoryId);
    }
  }
  private findSubcategoryBySlug(subcategoryId: number): void {
    let found = false;
    this.categoryService.categoriesWithSubcategories$.forEach((categories) => {
      if (!found) {
        categories.forEach((category) => {
          category.subcategories.forEach((subcategory) => {
            if (subcategory.id === subcategoryId) {
              this.categoryId = subcategory.category.id;
              this.subcategoryForm.patchValue({
                name: subcategory.name,
              });
              found = true;
            }
          });
        });
      }
    });
  }

  onSubmit() {
    debugger;
    if (this.subcategoryForm.invalid) {
      this.subcategoryForm.markAllAsTouched();
      return;
    }
    const subcategoryDto: SubcategoryDto = {
      ...this.subcategoryForm.value,
      categoryId: this.categoryId,
    };
    this.subcategoryService
      .updateSubcategory(this.subcategoryId, subcategoryDto)
      .subscribe({
        next: (response: BaseResponse) => {
          debugger;
          if (response.status === 200) {
            this.dialogRef.close(true);
            this.categoryService.getCategoriesWithSubcategories().subscribe();
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.toastr.error('Cập nhật danh mục con thất bại');
        },
      });
  }
}
