import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../../services/order.service';
import { ToastrService } from 'ngx-toastr';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrderResponse } from '../../../../responses/order/order.response';
import { OrderDetailResponse } from '../../../../responses/order/order-detail.response';
import { OrderAndOrderDetailsResponse } from '../../../../responses/order/order-orderdetails-response';
import { HandleOrderDto } from '../../../../dtos/order/handle-order.dto';
import { UpdateOrderDto } from '../../../../dtos/order/update.dto';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDatepickerModule,
    MatTableModule,
  ],
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class EditOrderComponent implements OnInit {
  orderForm: FormGroup;
  dataSource: MatTableDataSource<OrderDetailResponse> =
    new MatTableDataSource<OrderDetailResponse>();
  order: OrderResponse | null = null;
  displayedColumns: string[] = [
    'thumbnail',
    'productName',
    'quantity',
    'price',
  ];
  private statusTransitions: { [key: string]: string } = {
    pending: 'confirmed',
    confirmed: 'picked_up',
    picked_up: 'on_the_way',
    on_the_way: 'successful_delivery',
  };
  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.orderForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      deliveryAddress: ['', [Validators.required, Validators.minLength(5)]],
      note: ['', [Validators.minLength(5)]],
      status: ['', [Validators.required]],
      paymentMethod: ['', [Validators.required]],
      paymentStatus: ['', [Validators.required]],
      orderDate: ['', [Validators.required]],
      deliveryDate: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const orderId = this.activatedRoute.snapshot.paramMap.get('id');
    if (orderId) {
      this.getOrderDetails(orderId);
    }
  }
  getOrderDetails(orderId: string) {
    this.orderService.getOrderByOrderId(orderId).subscribe({
      next: (response: OrderAndOrderDetailsResponse) => {
        const orderDate = new Date(response.order.orderDate);
        const deliveryDate = new Date(response.order.deliveryDate);

        const orderDateString = `${orderDate.getFullYear()}-${(
          orderDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${orderDate
          .getDate()
          .toString()
          .padStart(2, '0')}`;
        const deliveryDateString = `${deliveryDate.getFullYear()}-${(
          deliveryDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${deliveryDate
          .getDate()
          .toString()
          .padStart(2, '0')}`;

        // Update form with new values
        this.orderForm.patchValue({
          ...response.order,
          orderDate: orderDateString,
          deliveryDate: deliveryDateString,
        });
        this.dataSource.data = response.orderDetails;
        this.order = response.order;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getNextStatus(currentStatus: string): string {
    return this.statusTransitions[currentStatus] || currentStatus;
  }

  handleOrder(orderId: string, status: string) {
    const nextStatus =
      status || this.getNextStatus(this.orderForm.get('status')?.value);
    const handleOrderDto: HandleOrderDto = {
      orderId,
      status: nextStatus,
    };
    debugger;
    this.orderService.handleOrder(handleOrderDto).subscribe({
      next: (response: OrderAndOrderDetailsResponse) => {
        this.toastr.success('Đã cập nhật trạng thái đơn hàng');
        const orderDate = new Date(response.order.orderDate);
        const deliveryDate = new Date(response.order.deliveryDate);

        const orderDateString = `${orderDate.getFullYear()}-${(
          orderDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${orderDate
          .getDate()
          .toString()
          .padStart(2, '0')}`;
        const deliveryDateString = `${deliveryDate.getFullYear()}-${(
          deliveryDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${deliveryDate
          .getDate()
          .toString()
          .padStart(2, '0')}`;

        // Update form with new values
        this.orderForm.patchValue({
          ...response.order,
          orderDate: orderDateString,
          deliveryDate: deliveryDateString,
        });
        this.order = response.order;
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Có lỗi xảy ra');
      },
    });
  }
  saveChanges(orderId: string, userId: string) {
    const updateOrderDto: UpdateOrderDto = {
      userId: userId,
      name: this.orderForm.get('name')?.value,
      phone: this.orderForm.get('phone')?.value,
      deliveryAddress: this.orderForm.get('deliveryAddress')?.value,
      note: this.orderForm.get('note')?.value,
      amount: this.orderForm.get('amount')?.value,
    };
    debugger;
    this.orderService.updateOrder(orderId, updateOrderDto).subscribe({
      next: (response: OrderAndOrderDetailsResponse) => {
        const orderDate = new Date(response.order.orderDate);
        const deliveryDate = new Date(response.order.deliveryDate);

        const orderDateString = `${orderDate.getFullYear()}-${(
          orderDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${orderDate
          .getDate()
          .toString()
          .padStart(2, '0')}`;
        const deliveryDateString = `${deliveryDate.getFullYear()}-${(
          deliveryDate.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${deliveryDate
          .getDate()
          .toString()
          .padStart(2, '0')}`;

        this.orderForm.patchValue({
          ...response.order,
          orderDate: orderDateString,
          deliveryDate: deliveryDateString,
        });
        this.order = response.order;
      },
      complete: () => {
        this.toastr.success('Đã cập nhật đơn hàng');
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Có lỗi xảy ra');
      },
    });
  }
}
