import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CategoryProductCountResponse } from '../../responses/category/category-product-counts.response';
import { ProductListResponse } from '../../responses/product/product-list.response';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../responses/product/product.response';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartDto } from '../../dtos/cart/cart.dto';
import { UserService } from '../../services/user.service';
import { CartResponse } from '../../responses/cart/cart.response';
import { ToastrService } from 'ngx-toastr';
import { CartListResponse } from '../../responses/cart/cart-list.response';
import { CommonModule } from '@angular/common';
import { ProductDetailResponse } from '../../responses/product/product-detail.response';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [HeaderComponent, FooterComponent, RouterModule, CommonModule],
})
export class HomeComponent implements OnInit {
  categoryProductCounts: CategoryProductCountResponse[] = [];
  products: ProductResponse[] = [];
  selectedCategoryId: number = 0;
  selectedSubCategoryId: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 8;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  localStorage?: Storage;
  product?: ProductDetailResponse | null = null;
  modalStyle: boolean = false;
  currentImage?: string = this.product?.thumbnail;
  quantity: number = 1;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
    this.currentPage =
      Number(this.localStorage?.getItem('currentProductPage')) || 0;
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 8;
    debugger;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }

  getProducts(
    keyword: string,
    selectedCategoryId: number,
    page: number,
    limit: number
  ) {
    debugger;
    this.productService
      .getProducts(keyword, selectedCategoryId, page, limit)
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
          timeOut: 5000,
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
