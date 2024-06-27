import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductDetailResponse } from '../../responses/product/product-detail.response';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CartDto } from '../../dtos/cart/cart.dto';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { CartListResponse } from '../../responses/cart/cart-list.response';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { CommentService } from '../../services/comment.service';
import { CommentResponse } from '../../responses/comment/comment.response';
import { CommentListResponse } from '../../responses/comment/comment-list.response';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
  imports: [
    HeaderComponent,
    FooterComponent,
    MatGridListModule,
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
  currentPage: number = 0;
  itemsPerPage: number = 8;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];

  comments: CommentResponse[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private toastr: ToastrService,
    private userService: UserService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    debugger;
    const productId = this.activatedRoute.snapshot.paramMap.get('id');

    if (productId !== null) {
      this.productId = +productId;
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
      console.error('Invalid productId:', productId);
    }
    this.currentPage =
      Number(this.localStorage?.getItem('currentCommentPage')) || 0;
    this.getComments();
  }

  thumbnailClick(index: number) {
    debugger;
    this.currentImageIndex = index;
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
          timeOut: 4000,
          easeTime: 400,
          progressBar: true,
        });
      },
    });
  }

  getComments() {
    this.commentService
      .getComments(this.productId, this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response: CommentListResponse) => {
          this.comments = response.comments.map(
            (comment) => new CommentResponse(comment)
          );
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(
            this.currentPage,
            this.totalPages
          );
        },
        error: (err) => console.log(err),
      });
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

  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentCommentPage', String(this.currentPage));
    this.getComments();
  }
}
