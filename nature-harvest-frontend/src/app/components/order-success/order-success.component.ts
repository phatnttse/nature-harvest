import { Component, OnInit, inject } from '@angular/core';
import { OrderResponse } from '../../responses/order/order.response';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderDetailService } from '../../services/order-detail.service';
import { OrderDetailResponse } from '../../responses/order/order-detail.response';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { MatButtonModule } from '@angular/material/button';
import { UserResponse } from '../../responses/user/user.response';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss',
})
export class OrderSuccessComponent implements OnInit {
  private orderDetailService = inject(OrderDetailService);
  private orderService = inject(OrderService);
  private activatedRoute = inject(ActivatedRoute);

  order: OrderResponse | null = null;
  orderDetails: OrderDetailResponse[] = [];
  userResponse?: UserResponse | null;

  constructor() {}

  ngOnInit(): void {
    const orderCode = this.activatedRoute.snapshot.paramMap.get('id');
    debugger;
    if (orderCode) {
      this.getOrder(orderCode);
      this.getOrderDetails(orderCode);
    }
  }

  getOrderDetails(orderId: string) {
    debugger;
    this.orderDetailService.getOrderDetails(orderId).subscribe({
      next: (response: OrderDetailResponse[]) => {
        debugger;
        this.orderDetails = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getOrder(orderId: string) {
    debugger;
    this.orderService.getOrderByOrderId(orderId).subscribe({
      next: (response: OrderResponse) => {
        debugger;
        this.order = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
