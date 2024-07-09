import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CategoryService } from '../../../../services/category.service';
import { SubCategoryService } from '../../../../services/subcategory.service';
import { BaseResponse } from '../../../../responses/base/base.response';

@Component({
  selector: 'app-delete-subcategory',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './delete-subcategory.component.html',
  styleUrl: './delete-subcategory.component.scss',
})
export class DeleteSubcategoryComponent {
  subcategoryId: number = 0;

  constructor(
    private dialogRef: MatDialogRef<DeleteSubcategoryComponent>,
    private subcategoryService: SubCategoryService,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.subcategoryId = this.data;
  }

  deleteSubCategory() {
    this.subcategoryService.deleteSubCategory(this.subcategoryId).subscribe({
      next: (response: BaseResponse) => {
        debugger;
        if (response.status !== 200) {
          this.dialogRef.close(false);
        }
        this.categoryService.getCategoriesWithSubcategories().subscribe();
        this.dialogRef.close(true);
      },
      error: (err) => console.log(err),
    });
  }
}
