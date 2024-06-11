import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderDto } from '../../dtos/order/order.dto';
import { PaymentService } from '../../services/payment.service';
import { MoMoPaymentDto } from '../../dtos/payment/momo-payment.dto';

@Component({
  selector: 'app-momo-pay',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './momo-pay.component.html',
  styleUrl: './momo-pay.component.scss',
})
export class MomoPayComponent implements OnInit {
  private paymentService = inject(PaymentService);

  requestType: string = 'captureWallet';
  lang: string = 'vi';
  orderInfo: OrderDto | null = null;

  ngOnInit(): void {
    this.orderInfo = this.paymentService.getOrderInfo();
  }

  submitForm() {
    debugger;
    const moMoPaymentDto: MoMoPaymentDto = {
      requestType: this.requestType,
      lang: this.lang,
      order: this.orderInfo!,
    };
    this.paymentService.moMoPayment(moMoPaymentDto).subscribe({
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
