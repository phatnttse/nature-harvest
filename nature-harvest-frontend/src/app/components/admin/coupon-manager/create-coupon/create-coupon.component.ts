import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { CouponResponse } from '../../../../responses/coupon/coupon.response';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateCouponDto } from '../../../../dtos/coupon/create.dto';

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
  selector: 'app-create-coupon',
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
  templateUrl: './create-coupon.component.html',
  styleUrl: './create-coupon.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class CreateCouponComponent {
  couponForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private couponService: CouponService,
    private router: Router,
    private toastr: ToastrService
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

  onSubmit() {
    if (this.couponForm.invalid) {
      this.couponForm.markAllAsTouched();
      return;
    }
    const coupon: CreateCouponDto = this.couponForm.value;
    this.couponService.createCoupon(coupon).subscribe({
      next: (response: CouponResponse) => {
        this.router.navigate(['/admin/coupons']);
        this.toastr.success('Tạo mã giảm giá thành công');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.toastr.error('Tạo mã giảm giá thất bại');
      },
    });
  }
}
