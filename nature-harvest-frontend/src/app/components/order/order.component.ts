import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { CartResponse } from '../../responses/cart/cart.response';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { CartListResponse } from '../../responses/cart/cart-list.response';
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
import { UserResponse } from '../../responses/user/user.response';
import { OrderDto } from '../../dtos/order/order.dto';
import { OrderResponse } from '../../responses/order/order.response';
import { ClearCartDto } from '../../dtos/cart/clear-cart.dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { PaymentService } from '../../services/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { VoucherComponent } from '../voucher/voucher.component';
import { CouponService } from '../../services/coupon.service';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from '../../responses/base/base.response';
import { CouponCalculationResponse } from '../../responses/coupon/calculate.response';

export function noSpaceOrSpecialCharsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = /[^a-zA-Z0-9 ]/.test(control.value);
    return forbidden ? { noSpaceOrSpecialChars: true } : null;
  };
}

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
})
export class OrderComponent implements OnInit {
  cart: CartResponse[] = [];
  userResponse?: UserResponse | null;
  orderForm: FormGroup;
  totalAmount: number = 0;
  isAppliedVoucher: boolean = false;

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private couponService: CouponService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.orderForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email, Validators.required]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      deliveryAddress: ['', [Validators.required, Validators.minLength(10)]],
      paymentMethod: ['', Validators.required],
      note: ['', Validators.maxLength(200)],
    });
  }

  ngOnInit(): void {
    this.userService.userResponse$.subscribe((userResponse) => {
      this.userResponse = userResponse;
      if (this.userResponse) {
        this.orderForm.patchValue({
          name: this.userResponse.name,
          email: this.userResponse.email,
          phone: this.userResponse.phone,
          deliveryAddress: this.userResponse.address,
        });
      }
    });
    this.getCart();
  }
  getCart() {
    this.cartService.getCart().subscribe({
      next: (response: CartListResponse) => {
        this.cart = response.cart;
        this.getTotalPrice();
        this.couponService.clearCoupons();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
  getTotalPrice() {
    this.totalAmount = this.cart.reduce(
      (total, item) => total + item.product.officialPrice * item.quantity,
      0
    );
  }

  placeOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }
    const orderDto: OrderDto = {
      userId: this.userResponse?.id || '',
      name: this.orderForm.value.name,
      email: this.orderForm.value.email,
      phone: this.orderForm.value.phone,
      deliveryAddress: this.orderForm.value.deliveryAddress,
      note: this.orderForm.value.note,
      paymentMethod: this.orderForm.value.paymentMethod,
      amount: this.totalAmount,
    };

    if (this.orderForm.value.paymentMethod === 'VNPAY') {
      this.paymentService.setOrderInfo(orderDto);
      this.router.navigate(['/vnpay-pay']);
    } else if (this.orderForm.value.paymentMethod === 'MOMO') {
      this.paymentService.setOrderInfo(orderDto);
      this.router.navigate(['/momo-pay']);
    } else if (this.orderForm.value.paymentMethod === 'COD') {
      this.orderService.placeOrder(orderDto).subscribe({
        next: (response: OrderResponse) => {
          this.clearCart();
          this.router.navigate(['/order-success', response.id]);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });
    }
  }
  clearCart(): void {
    const clearCartDto: ClearCartDto = {
      userId: this.userResponse?.id || '',
    };
    this.cartService.clearCart(clearCartDto).subscribe({
      next: (response: BaseResponse) => {
        if (response.status === 200) {
          this.cartService.updateCartState({ cart: [] });
        }
      },
      error: (error: HttpErrorResponse) => console.log(error),
    });
  }

  selectVoucher() {
    const dialogRef = this.dialog.open(VoucherComponent, {
      maxWidth: 'auto',
      maxHeight: 'auto',
      data: this.totalAmount,
    });
    if (dialogRef) {
      dialogRef
        .afterClosed()
        .subscribe((response: CouponCalculationResponse) => {
          if (response) {
            if (response.status === 200) {
              this.isAppliedVoucher = true;
              this.totalAmount = response.discountAmount;
            }
          }
        });
    }
  }
}
