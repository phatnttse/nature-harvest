import { Component, OnInit, inject } from '@angular/core';
import { UserResponse } from '../../responses/user/user.response';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { OrderDto } from '../../dtos/order/order.dto';
import { VnPayPaymentDto } from '../../dtos/payment/vnpay-payment.dto';

@Component({
  selector: 'app-vn-pay-pay',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vn-pay-pay.component.html',
  styleUrl: './vn-pay-pay.component.scss',
})
export class VnPayPayComponent implements OnInit {
  private router = inject(Router);
  private paymentService = inject(PaymentService);

  bankCode: string = '';
  language: string = 'vn';
  amount: number = 0;
  user?: UserResponse;
  orderInfo: OrderDto | null = null;
  // vnPayPaymentDto: VnPayPaymentDto | null = null;

  constructor() {}

  ngOnInit(): void {
    this.orderInfo = this.paymentService.getOrderInfo();
  }

  submitForm() {
    debugger;
    const vnPayPaymentDto: VnPayPaymentDto = {
      bankCode: this.bankCode,
      language: this.language,
      order: this.orderInfo!,
    };
    this.paymentService.vnPayPayment(vnPayPaymentDto).subscribe({
      next: (response: string) => {
        debugger;
        location.href = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
