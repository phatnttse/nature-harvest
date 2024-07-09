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
  selector: 'app-create-subcategory',
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
  templateUrl: './create-subcategory.component.html',
  styleUrl: './create-subcategory.component.scss',
})
export class CreateSubcategoryComponent {
  subcategoryForm: FormGroup;
  categoryId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private subcategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CreateSubcategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subcategoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
    });
    this.categoryId = this.data;
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
    this.subcategoryService.createSubcategory(subcategoryDto).subscribe({
      next: (response: BaseResponse) => {
        debugger;
        if (response.status === 200) {
          this.categoryService.getCategoriesWithSubcategories().subscribe();
          this.dialogRef.close(true);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.toastr.error('Tạo danh mục con thất bại');
      },
    });
  }
}
