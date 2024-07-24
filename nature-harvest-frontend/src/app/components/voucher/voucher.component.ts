import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CouponResponse } from '../../responses/coupon/coupon.response';
import { CouponService } from '../../services/coupon.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CouponCalculationResponse } from '../../responses/coupon/calculate.response';

@Component({
  selector: 'app-voucher',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './voucher.component.html',
  styleUrl: './voucher.component.scss',
})
export class VoucherComponent implements OnInit {
  coupons: CouponResponse[] = [];
  totalAmount: number = 0;
  isOpen: boolean = false;
  openConditions: { [key: string]: boolean } = {};

  constructor(
    private couponService: CouponService,
    private dialogRef: MatDialogRef<VoucherComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {
    this.totalAmount = this.data;
  }

  ngOnInit(): void {
    this.getCoupons();
  }

  getCoupons() {
    this.couponService.getCoupons().subscribe({
      next: (response: CouponResponse[]) => {
        this.coupons = response;
      },
      error: (error: HttpErrorResponse) => console.error(error),
    });
  }
  applyVoucher(couponCode: string) {
    this.couponService
      .calculateCouponDiscount(couponCode, this.totalAmount)
      .subscribe({
        next: (response: CouponCalculationResponse) => {
          this.dialogRef.close(response);
          this.couponService.addUsedCoupon(couponCode);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        },
      });
  }

  formatValue(value: string): string {
    const numericValue = parseInt(value, 10);
    if (numericValue >= 1000) {
      return (numericValue / 1000).toFixed(0) + 'K';
    }
    return value;
  }
  parseValue(value: string): number {
    return parseInt(value, 10);
  }
  isCouponUsed(couponCode: string): boolean {
    return this.couponService.getUsedCoupons().includes(couponCode);
  }
  toggleConditions(couponCode: string) {
    this.openConditions[couponCode] = !this.openConditions[couponCode];
  }
}
