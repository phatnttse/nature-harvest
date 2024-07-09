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
import { OrderService } from '../../../../services/order.service';
import { BaseResponse } from '../../../../responses/base/base.response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-order',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './delete-order.component.html',
  styleUrl: './delete-order.component.scss',
})
export class DeleteOrderComponent {
  orderId: string = '';
  constructor(
    private dialogRef: MatDialogRef<DeleteOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService
  ) {
    this.orderId = this.data;
  }

  deleteOrder() {
    this.orderService.deleteOrder(this.orderId).subscribe({
      next: (response: BaseResponse) => {
        debugger;
        if (response.status === 200) {
          this.dialogRef.close(true);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
}
