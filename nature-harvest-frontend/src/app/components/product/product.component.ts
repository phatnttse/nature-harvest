import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductResponse } from '../../responses/product/product.response';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductListResponse } from '../../responses/product/product-list.response';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MatListModule } from '@angular/material/list';
import { ProductDetailResponse } from '../../responses/product/product-detail.response';
import { CartListResponse } from '../../responses/cart/cart-list.response';
import { CartDto } from '../../dtos/cart/cart.dto';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryWithSubcategoriesResponse } from '../../responses/category/category-subcategory-response';
import { Observable, min } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [
    HeaderComponent,
    FooterComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatExpansionModule,
    MatSliderModule,
    MatPaginatorModule,
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    MatListModule,
    RouterModule,
  ],
})
export class ProductComponent implements OnInit {
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
  panelOpenState = false;
  minPrice: number = 0;
  maxPrice: number = 0;
  product?: ProductDetailResponse | null = null;
  modalStyle: boolean = false;
  currentImage?: string = this.product?.thumbnail;
  quantity: number = 1;
  openSubcategories: { [key: number]: boolean } = {};
  categoriesWithSubcategories$: Observable<CategoryWithSubcategoriesResponse[]>;
  sortBy: string = '';
  arrange: string = '';
  typeArrange: string = 'Mặc định';
  isFiltering: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.categoriesWithSubcategories$ =
      this.categoryService.categoriesWithSubcategories$;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const selectedCategoryId = +params['c'] || 0;
      const selectedSubCategoryId = +params['sc'] || 0;
      this.getProductsByCondition(
        this.minPrice,
        10000000,
        this.keyword,
        selectedCategoryId,
        selectedSubCategoryId,
        this.sortBy,
        this.arrange,
        this.currentPage,
        this.itemsPerPage
      );
    });
    this.currentPage =
      Number(this.localStorage?.getItem('currentProductPage')) || 0;
  }

  getProductsByCondition(
    minPrice: number,
    maxPrice: number,
    keyword: string,
    selectedCategoryId: number,
    selectedSubCategoryId: number,
    sortBy: string,
    arrange: string,
    page: number,
    limit: number
  ) {
    debugger;
    this.selectedCategoryId = selectedCategoryId;
    this.selectedSubCategoryId = selectedSubCategoryId;
    this.sortBy = sortBy;
    this.arrange = arrange;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.productService
      .getProductsByCondition(
        minPrice,
        maxPrice,
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
          this.isFiltering = false;
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
    if (this.isFiltering) {
      this.filterProductsByPrice();
    } else {
      this.getProductsByCondition(
        this.minPrice,
        this.maxPrice,
        this.keyword,
        this.selectedCategoryId,
        this.selectedSubCategoryId,
        this.sortBy,
        this.arrange,
        this.currentPage,
        this.itemsPerPage
      );
    }
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
  filterProductsByPrice() {
    debugger;
    this.productService
      .filterProductsByPrice(
        this.minPrice,
        this.maxPrice,
        this.keyword,
        this.selectedCategoryId,
        this.selectedSubCategoryId,
        this.sortBy,
        this.arrange,
        this.currentPage,
        this.itemsPerPage
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
          this.isFiltering = true;
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching products:', error);
          console.log(error);
        },
      });
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

  arrageDefault() {
    this.getProductsByCondition(
      this.minPrice,
      this.maxPrice,
      this.keyword,
      this.selectedCategoryId,
      this.selectedSubCategoryId,
      'id',
      'ascending',
      this.currentPage,
      this.itemsPerPage
    );
    this.sortBy = 'id';
    this.arrange = 'ascending';
    this.typeArrange = 'Mặc định';
  }

  arrangeByTitleAtoZ() {
    this.getProductsByCondition(
      this.minPrice,
      this.maxPrice,
      this.keyword,
      this.selectedCategoryId,
      this.selectedSubCategoryId,
      'title',
      'ascending',
      this.currentPage,
      this.itemsPerPage
    );
    this.sortBy = 'title';
    this.arrange = 'ascending';
    this.typeArrange = 'A → Z';
  }

  arrangeByTitleZtoA() {
    this.getProductsByCondition(
      this.minPrice,
      this.maxPrice,
      this.keyword,
      this.selectedCategoryId,
      this.selectedSubCategoryId,
      'title',
      'descending',
      this.currentPage,
      this.itemsPerPage
    );
    this.sortBy = 'title';
    this.arrange = 'descending';
    this.typeArrange = 'Z → A';
  }

  arrangeByPriceAscending() {
    this.getProductsByCondition(
      this.minPrice,
      this.maxPrice,
      this.keyword,
      this.selectedCategoryId,
      this.selectedSubCategoryId,
      'officialPrice',
      'ascending',
      this.currentPage,
      this.itemsPerPage
    );
    this.sortBy = 'officialPrice';
    this.arrange = 'ascending';
    this.typeArrange = 'Giá tăng dần';
  }

  arrangeByPriceDescending() {
    this.getProductsByCondition(
      this.minPrice,
      this.maxPrice,
      this.keyword,
      this.selectedCategoryId,
      this.selectedSubCategoryId,
      'officialPrice',
      'descending',
      this.currentPage,
      this.itemsPerPage
    );
    this.sortBy = 'officialPrice';
    this.arrange = 'descending';
    this.typeArrange = 'Giá giảm dần';
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
  toggleSubcategory(categoryId: number) {
    this.openSubcategories[categoryId] = !this.openSubcategories[categoryId];
  }
  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }
}
