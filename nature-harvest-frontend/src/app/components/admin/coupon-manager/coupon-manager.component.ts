import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CouponService } from '../../../services/coupon.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CouponResponse } from '../../../responses/coupon/coupon.response';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteCouponComponent } from './delete-coupon/delete-coupon.component';

@Component({
  selector: 'app-coupon-manager',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
  ],
  templateUrl: './coupon-manager.component.html',
  styleUrl: './coupon-manager.component.scss',
})
export class CouponManagerComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<CouponResponse>();
  displayedColumns: string[] = [
    'code',
    'discountType',
    'value',
    'discountAmount',
    'startDate',
    'endDate',
    'action',
  ];

  constructor(
    private couponService: CouponService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCoupons();
  }

  getCoupons() {
    this.couponService.getCoupons().subscribe({
      next: (response: CouponResponse[]) => {
        this.dataSource.data = response;
      },
      error: (error: HttpErrorResponse) => console.error(error),
    });
  }

  openDialog(couponId: number) {
    const dialogRef = this.dialog.open(DeleteCouponComponent, {
      width: '400px',
      data: couponId,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getCoupons();
        this.toastr.success('Xoá mã giảm giá thành công');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
