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
import { BaseResponse } from '../../../../responses/base/base.response';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './delete-category.component.html',
  styleUrl: './delete-category.component.scss',
})
export class DeleteCategoryComponent {
  categoryId: number = 0;

  constructor(
    private dialogRef: MatDialogRef<DeleteCategoryComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categoryId = this.data;
  }

  deleteCategory() {
    this.categoryService.deleteCategory(this.data.categoryId).subscribe({
      next: (response: BaseResponse) => {
        debugger;
        if (response.status !== 200) {
          this.dialogRef.close(false);
        }
        this.dialogRef.close(true);
      },
      error: (err) => console.log(err),
    });
  }
}
