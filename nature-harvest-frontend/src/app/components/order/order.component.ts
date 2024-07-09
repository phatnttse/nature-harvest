import { Component, OnInit, inject } from '@angular/core';
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
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
  ],
})
export class OrderComponent implements OnInit {
  cart: CartResponse[] = [];
  userResponse?: UserResponse | null;
  orderForm: FormGroup;
  orderData: OrderDto = {
    userId: '',
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    note: '',
    paymentMethod: '',
    amount: 0,
  };

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.orderForm = this.formBuilder.group({
      name: ['Nguyen Tran Tan Phat', Validators.required],
      email: ['phatntt1923@gmail.com', [Validators.email, Validators.required]],
      phone: ['0987654321', [Validators.required, Validators.minLength(6)]],
      deliveryAddress: [
        '32 TL, Q9',
        [Validators.required, Validators.minLength(5)],
      ],
      paymentMethod: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.userResponse$.subscribe((userResponse) => {
      this.userResponse = userResponse;
    });
    this.getCart();
  }
  getCart() {
    this.cartService.getCart().subscribe({
      next: (response: CartListResponse) => {
        this.cart = response.cart;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getTotalPrice(): number {
    return this.cart.reduce(
      (total, item) => total + item.product.officialPrice * item.quantity,
      0
    );
  }

  placeOrder() {
    debugger;
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    debugger;
    this.orderData = {
      ...this.orderData,
      ...this.orderForm.value,
    };
    this.orderData.amount = this.getTotalPrice();
    this.orderData.userId = this.userResponse?.id || '';

    if (this.orderData.paymentMethod === 'VNPAY') {
      this.paymentService.setOrderInfo(this.orderData);
      this.router.navigate(['/vnpay-pay']);
    } else if (this.orderData.paymentMethod === 'MOMO') {
      this.paymentService.setOrderInfo(this.orderData);
      this.router.navigate(['/momo-pay']);
    } else {
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response: OrderResponse) => {
          debugger;
          this.clearCart();
          this.router.navigate(['/order-success', response.id]);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  clearCart() {
    debugger;
    const clearCartDto: ClearCartDto = {
      userId: this.userResponse?.id || '',
    };
    this.cartService.clearCart(clearCartDto).subscribe({
      next: (response: any) => {
        debugger;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  selectVoucher() {
    this.dialog.open(VoucherComponent, {
      maxWidth: 'auto',
      maxHeight: 'auto',
    });
  }
}
