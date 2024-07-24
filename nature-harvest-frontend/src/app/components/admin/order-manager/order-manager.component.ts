import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeatherModule } from 'angular-feather';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrderResponse } from '../../../responses/order/order.response';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../services/order.service';
import { OrderListResponse } from '../../../responses/order/order-list.response';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteOrderComponent } from './delete-order/delete-order.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-order-manager',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatPaginatorModule,
    MatFormFieldModule,
    FeatherModule,
    MatSortModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './order-manager.component.html',
  styleUrl: './order-manager.component.scss',
})
export class OrderManagerComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  keyword: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 8;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  localStorage?: Storage;
  dataSource: MatTableDataSource<OrderResponse> =
    new MatTableDataSource<OrderResponse>();
  displayedColumns: string[] = [
    'id',
    'name',
    'status',
    'amount',
    'paymentMethod',
    'orderDate',
    'action',
  ];
  orders: OrderResponse[] = [];

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.getOrders(this.keyword, this.currentPage, this.itemsPerPage);
    this.currentPage =
      Number(this.localStorage?.getItem('currentOrderManagerPage')) || 0;
  }

  getOrders(keyword: string, page: number, limit: number) {
    this.orderService.getOrders(keyword, page, limit).subscribe({
      next: (response: OrderListResponse) => {
        this.dataSource = new MatTableDataSource(response.orders);
        this.dataSource.sort = this.sort;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(
          this.currentPage,
          this.totalPages
        );
      },
      error: (error: HttpErrorResponse) => console.error(error),
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem(
      'currentOrderManagerPage',
      String(this.currentPage)
    );
    this.getOrders(this.keyword, this.currentPage, this.itemsPerPage);
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openDialog(orderId: string) {
    const dialogRef = this.dialog.open(DeleteOrderComponent, {
      width: '400px',
      data: orderId,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getOrders(this.keyword, this.currentPage, this.itemsPerPage);
        this.toastr.success('Xoá đơn hàng thành công');
      }
    });
  }
}
