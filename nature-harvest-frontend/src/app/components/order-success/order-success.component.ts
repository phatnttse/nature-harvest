import { Component, OnInit, inject } from '@angular/core';
import { OrderResponse } from '../../responses/order/order.response';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderDetailService } from '../../services/order-detail.service';
import { OrderDetailResponse } from '../../responses/order/order-detail.response';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { MatButtonModule } from '@angular/material/button';
import { UserResponse } from '../../responses/user/user.response';
import { OrderAndOrderDetailsResponse } from '../../responses/order/order-orderdetails-response';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss',
})
export class OrderSuccessComponent implements OnInit {

  constructor(
    private orderDetailService: OrderDetailService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute
  ) {}

  order: OrderResponse | null = null;
  orderDetails: OrderDetailResponse[] = [];
  userResponse?: UserResponse | null;

  ngOnInit(): void {
    const orderCode = this.activatedRoute.snapshot.paramMap.get('id');
    debugger;
    if (orderCode) {
      this.getOrder(orderCode);
    }
  }

  getOrder(orderId: string) {
    debugger;
    this.orderService.getOrderByOrderId(orderId).subscribe({
      next: (response: OrderAndOrderDetailsResponse) => {
        debugger;
        this.order = response.order;
        this.orderDetails = response.orderDetails;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
