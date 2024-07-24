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
import { OrderTrackingResponse } from '../../responses/order/order-tracking.response';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CancelOrderComponent } from '../dialog/cancel-order/cancel-order.component';
import { ToastrService } from 'ngx-toastr';

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
    MatTabsModule,
    MatProgressSpinnerModule,
  ],
})
export class OrderTrackingComponent implements OnInit {
  orderAndOrderDetails: OrderAndOrderDetailsResponse[] = [];
  orders: OrderTrackingResponse = new OrderTrackingResponse({});
  currentPage: number = 0;
  itemsPerPage: number = 3;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  localStorage?: Storage;
  status: string = 'pending';

  steps = [
    {
      label: 'Đơn hàng chờ xác nhận',
      status: 'pending',
      icon: 'fa fa-hourglass-start',
      count: 0,
    },
    {
      label: 'Đơn hàng được xác nhận',
      status: 'confirmed',
      icon: 'fa fa-check',
      count: 0,
    },
    {
      label: 'Đã lấy hàng bởi người vận chuyển',
      status: 'picked_up',
      icon: 'fa fa-user',
      count: 0,
    },
    {
      label: 'Đang trên đường',
      status: 'on_the_way',
      icon: 'fa fa-truck',
      count: 0,
    },
    {
      label: 'Giao hàng thành công',
      status: 'successful_delivery',
      icon: 'fa fa-box',
      count: 0,
    },
  ];
  refusedStatus = {
    label: 'Đơn hàng bị từ chối',
    status: 'refused',
    icon: 'fa fa-times-circle',
  };
  cancelledStatus = {
    label: 'Đã hủy',
    status: 'cancelled',
    icon: 'fa fa-ban',
  };
  tabs = [
    { label: 'Chờ xác nhận', count: 0 },
    { label: 'Đã xác nhận', count: 0 },
    { label: 'Đã lấy hàng', count: 0 },
    { label: 'Đang giao hàng', count: 0 },
    { label: 'Giao hàng thành công', count: 0 },
    { label: 'Đã hủy', count: 0 },
  ];
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getOrdersByStatus();
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
  openCancelOrderDialog(orderId: string) {
    const dialogRef = this.dialog.open(CancelOrderComponent, {
      width: '600px',
      data: orderId,
    });

    dialogRef.afterClosed().subscribe((result: OrderTrackingResponse) => {
      if (result) {
        this.orderAndOrderDetails = result.orders;
        this.tabs[0].count = result.totalPending;
        this.tabs[5].count = result.totalCanceled;

        this.toastr.success('Hủy đơn hàng thành công', '', {
          progressBar: true,
        });
      }
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    const statusMap = [
      'pending',
      'confirmed',
      'picked_up',
      'on_the_way',
      'successful_delivery',
      'cancelled',
    ];
    this.status = statusMap[event.index];
    this.getOrdersByStatus();
  }

  getOrdersByStatus() {
    this.orderService
      .getOrdersByStatus(this.status, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response: OrderTrackingResponse) => {
          this.orders = response;
          this.orderAndOrderDetails = response.orders;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(
            this.currentPage,
            this.totalPages
          );
          this.tabs[0].count = response.totalPending;
          this.tabs[1].count = response.totalConfirmed;
          this.tabs[2].count = response.totalPickedUp;
          this.tabs[3].count = response.totalOnTheWay;
          this.tabs[4].count = response.totalSuccessDelivery;
          this.tabs[5].count = response.totalCanceled;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem(
      'currentOrderTrackingPage',
      String(this.currentPage)
    );
    this.getOrdersByStatus();
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }
}
