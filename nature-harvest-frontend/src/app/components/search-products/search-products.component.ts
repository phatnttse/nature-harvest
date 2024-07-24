import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductResponse } from '../../responses/product/product.response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { ProductListResponse } from '../../responses/product/product-list.response';
import { ProductDetailResponse } from '../../responses/product/product-detail.response';
import { CartDto } from '../../dtos/cart/cart.dto';
import { CartListResponse } from '../../responses/cart/cart-list.response';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search-products',
  standalone: true,
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.scss',
  imports: [
    HeaderComponent,
    BreadcrumbComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
})
export class SearchProductsComponent implements OnInit {
  products: ProductResponse[] = [];
  pages: number[] = [];
  totalPages: number = 0;
  itemsPerPage: number = 12;
  selectedCategoryId: number = 0;
  selectedSubCategoryId: number = 0;
  visiblePages: number[] = [];
  currentPage: number = 0;
  localStorage?: Storage;
  keyword: string = '';
  panelOpenState = false;
  minPrice: number = 0;
  maxPrice: number = 0;
  product?: ProductDetailResponse | null = null;
  modalStyle: boolean = false;
  currentImage?: string = this.product?.thumbnail;
  quantity: number = 1;
  sortBy: string = '';
  arrange: string = '';

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private cartService: CartService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.keyword = params['q'] || '';
      if (params['q'] != null) {
        this.getProducts(
          this.keyword,
          this.selectedCategoryId,
          this.selectedSubCategoryId,
          this.sortBy,
          this.arrange,
          this.currentPage,
          this.itemsPerPage
        );
      }
    });
  }

  getProducts(
    keyword: string,
    selectedCategoryId: number,
    selectedSubCategoryId: number,
    sortBy: string,
    arrange: string,
    page: number,
    limit: number
  ) {
    debugger;
    this.productService
      .getProducts(
        keyword,
        selectedCategoryId,
        selectedSubCategoryId,
        sortBy,
        arrange,
        page,
        limit
      )
      .subscribe({
        next: (response: ProductListResponse) => {
          debugger;
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(
            this.currentPage,
            this.totalPages
          );
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
        },
      });
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductPage', String(this.currentPage));
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.selectedCategoryId,
      this.sortBy,
      this.arrange,
      this.currentPage,
      this.itemsPerPage
    );
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

  addProductToCart(productId: number, title: string) {
    debugger;
    const user = this.userService.getUserResponseFromLocalStorage();
    const cartDto: CartDto = {
      userId: user?.id ?? '',
      productId: productId,
      quantity: this.quantity,
    };
    this.cartService.addProductToCart(cartDto).subscribe({
      next: (response: CartListResponse) => {
        debugger;
        this.cartService.updateCartState(response);
        this.closeModal();
        this.toastr.success(`Bạn vừa thêm ${title} vào giỏ hàng`, '', {
          closeButton: true,
          timeOut: 4000,
          easeTime: 400,
          progressBar: true,
        });
      },
      error(err) {
        console.log(err);
      },
    });
  }
  quickViewProduct(productId: number) {
    this.productService.getDetailProduct(productId).subscribe({
      next: (response: ProductDetailResponse) => {
        this.product = response;
        this.currentImage = this.product.thumbnail;
        this.modalStyle = true;
      },
      error(err) {
        console.log(err);
      },
    });
  }
  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  closeModal() {
    this.modalStyle = false;
  }
  thumbnailClick(imageUrl: string) {
    debugger;
    this.currentImage = imageUrl;
  }
}
