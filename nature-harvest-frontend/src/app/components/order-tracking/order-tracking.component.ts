import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { FooterComponent } from '../footer/footer.component';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderAndOrderDetailsResponse } from '../../responses/order/order-orderdetails-response';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { FeedbackComponent } from '../dialog/feedback/feedback.component';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  templateUrl: './order-tracking.component.html',
  styleUrl: './order-tracking.component.scss',
  imports: [
    HeaderComponent,
    BreadcrumbComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
  ],
})
export class OrderTrackingComponent implements OnInit {
  orderAndOrderDetails: OrderAndOrderDetailsResponse[] = [];

  steps = [
    {
      label: 'Đơn hàng chờ xác nhận',
      status: 'pending',
      icon: 'fa fa-hourglass-start',
    },
    {
      label: 'Đơn hàng được xác nhận',
      status: 'confirmed',
      icon: 'fa fa-check',
    },
    {
      label: 'Đã lấy hàng bởi người vận chuyển',
      status: 'picked_up',
      icon: 'fa fa-user',
    },
    { label: 'Đang trên đường', status: 'on_the_way', icon: 'fa fa-truck' },
    {
      label: 'Giao hàng thành công',
      status: 'successful_delivery',
      icon: 'fa fa-box',
    },
  ];
  refusedStatus = {
    label: 'Đơn hàng bị từ chối',
    status: 'refused',
    icon: 'fa fa-times-circle',
  };
  cancelledStatus = {
    label: 'Đơn hàng bị hủy',
    status: 'cancelled',
    icon: 'fa fa-ban',
  };

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getOrderAndOrderDetails();
  }

  getOrderAndOrderDetails() {
    const user = this.userService.getUserResponseFromLocalStorage();
    if (user) {
      this.orderService.getOrdersByUserId(user.id).subscribe({
        next: (response: OrderAndOrderDetailsResponse[]) => {
          this.orderAndOrderDetails = response;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
  isActiveStep(orderStatus: string, stepStatus: string): boolean {
    const statusOrder = [
      'pending',
      'confirmed',
      'picked_up',
      'on_the_way',
      'successful_delivery',
    ];
    return statusOrder.indexOf(orderStatus) >= statusOrder.indexOf(stepStatus);
  }

  openDialog(order: OrderAndOrderDetailsResponse) {
    debugger;
    const dialogRef = this.dialog.open(FeedbackComponent, {
      position: { top: '180px' },
      minWidth: '800px',
      minHeight: '400px',
      data: { order },
    });

    dialogRef
      .afterClosed()
      .subscribe((result: OrderAndOrderDetailsResponse[]) => {
        if (result) {
          this.orderAndOrderDetails = result;
        }
      });
  }
}
