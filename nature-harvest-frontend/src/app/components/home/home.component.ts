import { ProductResponse } from './../../responses/product/product.response';
import { CategoryService } from './../../services/category.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductListResponse } from '../../responses/product/product-list.response';
import { ProductService } from '../../services/product.service';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartDto } from '../../dtos/cart/cart.dto';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CartListResponse } from '../../responses/cart/cart-list.response';
import { CommonModule } from '@angular/common';
import { ProductDetailResponse } from '../../responses/product/product-detail.response';
import { Observable } from 'rxjs';
import { CategoryWithSubcategoriesResponse } from '../../responses/category/category-subcategory-response';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [HeaderComponent, FooterComponent, RouterModule, CommonModule],
})
export class HomeComponent implements OnInit {
  products: ProductResponse[] = [];
  selectedCategoryId: number = 1;
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
  categoriesWithSubcategories$: Observable<CategoryWithSubcategoriesResponse[]>;
  bestSellerProducts: ProductResponse[] = [];
  promotionalProducts: ProductResponse[] = [];
  sortBy: string = '';
  arrange: string = '';

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.categoriesWithSubcategories$ =
      this.categoryService.categoriesWithSubcategories$;
  }

  ngOnInit(): void {
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.selectedSubCategoryId,
      this.sortBy,
      this.arrange,
      this.currentPage,
      this.itemsPerPage
    );
    this.currentPage =
      Number(this.localStorage?.getItem('currentProductPage')) || 0;
    this.getBestSellerProducts();
    this.getPromotionalProducts();
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
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(
            this.currentPage,
            this.totalPages
          );
        },
        complete: () => {},
        error: (error: any) => {
          debugger;
          console.error(error);
        },
      });
  }

  getBestSellerProducts() {
    debugger;
    this.productService
      .getProducts(
        this.keyword,
        0,
        this.selectedSubCategoryId,
        'purchases',
        'descending',
        this.currentPage,
        6
      )
      .subscribe({
        next: (response: ProductListResponse) => {
          debugger;
          this.bestSellerProducts = response.products;
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
          console.error(error);
        },
      });
  }
  getPromotionalProducts() {
    debugger;
    this.productService
      .getProducts(
        this.keyword,
        0,
        this.selectedSubCategoryId,
        'discount',
        'descending',
        this.currentPage,
        8
      )
      .subscribe({
        next: (response: ProductListResponse) => {
          debugger;
          this.promotionalProducts = response.products;
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
          console.error(error);
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
      this.selectedSubCategoryId,
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
    if (user == null) {
      this.router.navigate(['/login']);
      this.toastr.info('Bạn cần đăng nhập để mua sắm', '', {
        closeButton: true,
        timeOut: 4000,
        easeTime: 400,
        progressBar: true,
      });
    } else {
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
  selectCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }
}
