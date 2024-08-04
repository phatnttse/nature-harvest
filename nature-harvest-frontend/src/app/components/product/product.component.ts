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
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { CategoryWithSubcategoriesResponse } from '../../responses/category/category-subcategory-response';
import { Observable, filter } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatCheckboxModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
})
export class ProductComponent implements OnInit {
  products: ProductResponse[] = [];
  selectedCategoryId: number = 0;
  selectedSubCategoryId: number = 0;
  categorySlug: string = '';
  subcategorySlug: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 24;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  localStorage?: Storage;
  panelOpenState = false;
  minPrice: number = 0;
  maxPrice: number = 1000000;
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
  checked: boolean = true;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoriesWithSubcategories$ =
      this.categoryService.categoriesWithSubcategories$;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadProducts();
      });

    this.loadProducts();
  }

  loadProducts() {
    const categorySlug = this.route.snapshot.paramMap.get('category-slug');
    const subcategorySlug =
      this.route.snapshot.paramMap.get('subcategory-slug');
    debugger;
    if (categorySlug) {
      this.getProductsByCondition(
        this.minPrice,
        this.maxPrice,
        this.keyword,
        this.selectedCategoryId,
        this.selectedSubCategoryId,
        categorySlug,
        this.subcategorySlug,
        this.sortBy,
        this.arrange,
        this.currentPage,
        this.itemsPerPage
      );
      this.categorySlug = categorySlug;
    } else if (subcategorySlug) {
      this.getProductsByCondition(
        this.minPrice,
        this.maxPrice,
        this.keyword,
        this.selectedCategoryId,
        this.selectedSubCategoryId,
        this.categorySlug,
        subcategorySlug,
        this.sortBy,
        this.arrange,
        this.currentPage,
        this.itemsPerPage
      );
      this.subcategorySlug = subcategorySlug;
    } else {
      this.getProductsByCondition(
        this.minPrice,
        this.maxPrice,
        this.keyword,
        this.selectedCategoryId,
        this.selectedSubCategoryId,
        this.categorySlug,
        this.subcategorySlug,
        this.sortBy,
        this.arrange,
        this.currentPage,
        this.itemsPerPage
      );
    }
    this.currentPage =
      Number(this.localStorage?.getItem('currentProductPage')) || 0;
  }

  getProductsByCondition(
    minPrice: number,
    maxPrice: number,
    keyword: string,
    selectedCategoryId: number,
    selectedSubCategoryId: number,
    categorySlug: string,
    subcategorySlug: string,
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
        categorySlug,
        subcategorySlug,
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
        this.categorySlug,
        this.subcategorySlug,
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

  selectPrice(selectedPriceRange: string) {
    switch (selectedPriceRange) {
      case '100k':
        this.minPrice = 0;
        this.maxPrice = 100000;
        break;
      case '100k-200k':
        this.minPrice = 100000;
        this.maxPrice = 200000;
        break;
      case '200k-300k':
        this.minPrice = 200000;
        this.maxPrice = 300000;
        break;
      case '300k-500k':
        this.minPrice = 300000;
        this.maxPrice = 500000;
        break;
      case '500k-1000k':
        this.minPrice = 500000;
        this.maxPrice = 1000000;
        break;
      case '1000k-2000k':
        this.minPrice = 1000000;
        this.maxPrice = 2000000;
        break;
      default:
        this.minPrice = 0;
        this.maxPrice = 0;
        break;
    }
    debugger;
    this.filterProductsByPrice();
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
        this.categorySlug,
        this.subcategorySlug,
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
    const user = this.userService.getUserResponseFromLocalStorage();
    if (user === null) {
      this.router.navigate(['/login']);
      this.toastr.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', '', {
        closeButton: true,
        timeOut: 4000,
        progressBar: true,
      });
      return;
    } else {
      const cartDto: CartDto = {
        userId: user?.id ?? '',
        productId: productId,
        quantity: this.quantity,
      };
      this.cartService.addProductToCart(cartDto).subscribe({
        next: (response: CartListResponse) => {
          this.cartService.updateCartState(response);
          this.closeModal();
          this.toastr.success(`Bạn vừa thêm ${title} vào giỏ hàng`, '', {
            closeButton: true,
            timeOut: 4000,
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

  arrangeDefault() {
    this.getProductsByCondition(
      this.minPrice,
      this.maxPrice,
      this.keyword,
      this.selectedCategoryId,
      this.selectedSubCategoryId,
      this.categorySlug,
      this.subcategorySlug,
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
      this.categorySlug,
      this.subcategorySlug,
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
      this.categorySlug,
      this.subcategorySlug,
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
      this.categorySlug,
      this.subcategorySlug,
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
      this.categorySlug,
      this.subcategorySlug,
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
