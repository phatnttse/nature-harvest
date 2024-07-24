import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DeleteOrderComponent } from '../../admin/order-manager/delete-order/delete-order.component';
import { OrderService } from '../../../services/order.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { HandleOrderDto } from '../../../dtos/order/handle-order.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderAndOrderDetailsResponse } from '../../../responses/order/order-orderdetails-response';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrderTrackingResponse } from '../../../responses/order/order-tracking.response';

function atLeastOneFieldValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const reasonSelect = formGroup.get('reasonSelect')?.value;
    const reasonInput = formGroup.get('reasonInput')?.value;

    if (!reasonSelect && !reasonInput) {
      return { atLeastOneFieldRequired: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-cancel-order',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cancel-order.component.html',
  styleUrl: './cancel-order.component.scss',
})
export class CancelOrderComponent {
  orderId: string = '';
  cancelOrderForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DeleteOrderComponent>,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.orderId = this.data;
    this.cancelOrderForm = this.formBuilder.group(
      {
        reasonSelect: [''],
        reasonInput: [''],
      },
      { validators: atLeastOneFieldValidator() }
    );
  }

  cancelOrder() {
    if (this.cancelOrderForm.invalid) {
      this.toastr.warning('Bạn cần chọn hoặc nhập lý do hủy đơn hàng');
      return;
    }
    this.orderService.cancelOrder(this.orderId).subscribe({
      next: (response: OrderTrackingResponse) => {
        this.dialogRef.close(response);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
}
