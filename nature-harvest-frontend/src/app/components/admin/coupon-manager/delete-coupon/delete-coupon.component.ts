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
import { CouponService } from '../../../../services/coupon.service';
import { BaseResponse } from '../../../../responses/base/base.response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-coupon',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './delete-coupon.component.html',
  styleUrl: './delete-coupon.component.scss',
})
export class DeleteCouponComponent {
  couponId: number = 0;
  constructor(
    private dialogRef: MatDialogRef<DeleteCouponComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private couponService: CouponService
  ) {
    this.couponId = this.data;
  }

  deleteCoupon() {
    this.couponService.deleteCoupon(this.couponId).subscribe({
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
