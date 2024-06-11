import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductDetailResponse } from '../../responses/product/product-detail.response';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CartDto } from '../../dtos/cart/cart.dto';
import { CartService } from '../../services/cart.service';
import { CartResponse } from '../../responses/cart/cart.response';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { CartListResponse } from '../../responses/cart/cart-list.response';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  imports: [
    HeaderComponent,
    FooterComponent,
    MatGridListModule,
    NgbModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BreadcrumbComponent,
  ],
})
export class ProductDetailComponent implements OnInit {
  product?: ProductDetailResponse | null;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  localStorage?: Storage;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    debugger;
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: ProductDetailResponse) => {
          debugger;
          this.product = response;
        },
        complete: () => {
          debugger;
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        },
      });
    } else {
      console.error('Invalid productId:', idParam);
    }
  }

  thumbnailClick(index: number) {
    debugger;
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }
  nextImage(): void {
    debugger;
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger;
    this.showImage(this.currentImageIndex - 1);
  }
  showImage(index: number): void {
    debugger;
    if (
      this.product &&
      this.product.productImages &&
      this.product.productImages.length > 0
    ) {
      // Đảm bảo index nằm trong khoảng hợp lệ
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.productImages.length) {
        index = this.product.productImages.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  addProductToCart(productId?: number, title?: string) {
    debugger;
    const user = this.userService.getUserResponseFromLocalStorage();
    const cartDto: CartDto = {
      userId: user?.id ?? '',
      productId: productId!,
      quantity: this.quantity,
    };
    this.cartService.addProductToCart(cartDto).subscribe({
      next: (response: CartListResponse) => {
        this.cartService.updateCartState(response);
        debugger;
        this.toastr.success(`Bạn vừa thêm ${title} vào giỏ hàng`, '', {
          closeButton: true,
          timeOut: 5000,
          easeTime: 600,
          progressBar: true,
        });
      },
    });
  }
}
