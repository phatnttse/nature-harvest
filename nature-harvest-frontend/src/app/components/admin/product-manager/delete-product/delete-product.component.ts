import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ProductService } from '../../../../services/product.service';
import { BaseResponse } from '../../../../responses/base/base.response';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './delete-product.component.html',
  styleUrl: './delete-product.component.scss',
})
export class DeleteProductComponent {
  productId: number = 0;

  constructor(
    private dialogRef: MatDialogRef<DeleteProductComponent>,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productId = this.data;
  }

  deleteProduct() {
    this.productService.deleteProduct(this.data.productId).subscribe({
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
