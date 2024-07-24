import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { CouponService } from '../../../../services/coupon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { CouponResponse } from '../../../../responses/coupon/coupon.response';
import { HttpErrorResponse } from '@angular/common/http';
import { UpdateCouponDto } from '../../../../dtos/coupon/update.dto';

// Custom validator function
function discountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) return null;

    const discountType = formGroup.get('discountType')?.value;
    const discountAmount = control.value;

    if (discountType === 'fixed' && discountAmount < 5000) {
      return { minFixedDiscount: true };
    }
    if (discountType === 'percentage' && discountAmount > 100) {
      return { maxPercentageDiscount: true };
    }

    return null;
  };
}

@Component({
  selector: 'app-edit-coupon',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  templateUrl: './edit-coupon.component.html',
  styleUrl: './edit-coupon.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class EditCouponComponent implements OnInit {
  couponForm: FormGroup;
  coupon: CouponResponse | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private couponService: CouponService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.couponForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(3)]],
      discountType: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      attribute: ['minimum_amount', [Validators.required]],
      operator: ['>=', [Validators.required]],
      value: ['', [Validators.min(0)]],
      discountAmount: [
        '',
        [Validators.required, Validators.min(0), discountValidator()],
      ],
      startDate: [null],
      endDate: [null],
    });
  }

  ngOnInit(): void {
    const couponId = this.activatedRoute.snapshot.paramMap.get('id');
    if (couponId) {
      this.getCouponById(+couponId);
    }
  }

  getCouponById(couponId: number) {
    this.couponService.getCouponById(couponId).subscribe({
      next: (response: CouponResponse) => {
        this.couponForm.patchValue(response);
        this.coupon = response;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  saveChanges() {
    if (this.couponForm.invalid) {
      this.couponForm.markAllAsTouched();
      return;
    }
    const coupon: UpdateCouponDto = this.couponForm.value;
    this.couponService.updateCoupon(this.coupon?.id!, coupon).subscribe({
      next: (response: CouponResponse) => {
        this.couponForm.patchValue(response);
        this.toastr.success('Cập nhật mã giảm giá thành công');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.toastr.error('Cập nhật mã giảm giá thất bại');
      },
    });
  }
}
