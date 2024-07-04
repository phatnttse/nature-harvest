import { CommentDto } from '../../../dtos/product/comment.dto';
import { Component, Inject } from '@angular/core';
import { OrderDetailResponse } from '../../../responses/order/order-detail.response';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { CommentService } from '../../../services/comment.service';
import { ToastrService } from 'ngx-toastr';
import { OrderAndOrderDetailsResponse } from '../../../responses/order/order-orderdetails-response';
import { cloudinary } from '../../../environments/environment.development';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatListModule,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  orderDetails?: OrderDetailResponse[];
  starIcons: string[] = [
    'star_border',
    'star_border',
    'star_border',
    'star_border',
    'star_border',
  ];
  selectedStars: number = 0;
  selectedProduct: number = 0;
  comment: string = '';
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  uploadedImage = '';
  uploadedImages: string[] = [];
  isDisabled = false;

  constructor(
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commentService: CommentService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<FeedbackComponent>
  ) {
    debugger;
    this.orderDetails = data.order.orderDetails;
    this.firstFormGroup = this._formBuilder.group({
      selectedProduct: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      comment: ['', Validators.required],
    });
  }

  setRating(stars: number) {
    this.selectedStars = stars;
    for (let i = 0; i < this.starIcons.length; i++) {
      if (i < stars) {
        this.starIcons[i] = 'star';
      } else {
        this.starIcons[i] = 'star_border';
      }
    }
  }

  onSubmit() {
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (this.data.order.orderDetails.reviewed === true) {
      this.toastr.warning('Bạn đã đánh giá sản phẩm này');
      return;
    }

    if (this.data.order.order.reviewed === true) {
      this.toastr.warning('Bạn đã đánh giá đơn hàng này');
      return;
    }

    const selectedProductId = Array.isArray(
      this.firstFormGroup.get('selectedProduct')?.value
    )
      ? this.firstFormGroup.get('selectedProduct')?.value[0]
      : this.firstFormGroup.get('selectedProduct')?.value;

    const commentDto: CommentDto = {
      productId: selectedProductId,
      orderId: this.data.order.order.id,
      content: this.secondFormGroup.get('comment')?.value,
      starRating: this.selectedStars,
      pictures: this.uploadedImages,
    };
    debugger;
    this.commentService.comment(commentDto).subscribe({
      next: (response: OrderAndOrderDetailsResponse[]) => {
        debugger;
        this.dialogRef.close(response);
        this.toastr.success('Đánh giá sản phẩm thành công');
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Đánh giá sản phẩm thất bại');
      },
    });
  }

  processResults = (error: any, result: any): void => {
    if (result.event === 'close') {
      this.isDisabled = false;
    }
    if (result && result.event === 'success') {
      const secureUrl = result.info.secure_url;
      this.uploadedImages.push(secureUrl);
      this.isDisabled = false;
    }
    if (error) {
      this.isDisabled = false;
    }
  };

  uploadWidget = (): void => {
    this.isDisabled = true;
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid) {
      this.toastr.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    window.cloudinary.openUploadWidget(
      {
        cloudName: cloudinary.cloudName,
        uploadPreset: cloudinary.uploadPreset,
        sources: ['local', 'url'],
        tags: ['myphotoalbum-nature-harvest'],
        clientAllowedFormats: ['image'],
        resourceType: 'image',
        maxFileSize: 5 * 1024 * 1024,
        multiple: true,
      },
      this.processResults
    );
  };
}
