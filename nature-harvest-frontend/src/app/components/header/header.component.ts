import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartListResponse } from '../../responses/cart/cart-list.response';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { CategoryWithSubcategoriesResponse } from '../../responses/category/category-subcategory-response';
import { FormsModule } from '@angular/forms';
import { ProductResponse } from '../../responses/product/product.response';
import { ProductService } from '../../services/product.service';
import { ProductListResponse } from '../../responses/product/product-list.response';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterModule, CommonModule, CommonModule, FormsModule],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userResponse?: UserResponse | null;
  cartSize: number = 0;
  cartSubscription: Subscription | null = null;
  showProductNavbar: boolean = false;
  categoriesWithSubcategories$: Observable<CategoryWithSubcategoriesResponse[]>;
  keyword: string = '';
  searchProductsResult: ProductResponse[] = [];
  products: ProductResponse[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.categoriesWithSubcategories$ =
      this.categoryService.categoriesWithSubcategories$;
  }

  ngOnInit(): void {
    const subscription = this.userService.userResponse$.subscribe(
      (userResponse) => {
        this.userResponse = userResponse;
        if (this.userResponse != null) this.getCart();
      }
    );

    this.cartSubscription = this.cartService.cart$.subscribe(
      (cartData: CartListResponse) => {
        this.cartSize = cartData.cart.length;
      }
    );
    this.subscriptions.push(subscription);
    this.categoryService.getCategoriesWithSubcategories().subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  logOut() {
    this.userService.clearUserResponse();
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
  getCart() {
    this.cartService.getCart().subscribe({
      next: (response: CartListResponse) => {
        this.cartSize = response.cart.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onSearch() {
    if (this.keyword.trim() === '') {
      this.searchProductsResult = [];
      return;
    }

    this.productService
      .getProducts(this.keyword, 0, 0, '', '', 0, 100)
      .subscribe({
        next: (response) => {
          this.searchProductsResult = response.products;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  search() {
    if (this.keyword.trim() === '') {
      this.searchProductsResult = [];
      return;
    }
    this.productService
      .getProducts(this.keyword, 0, 0, '', '', 0, 100)
      .subscribe({
        next: (response) => {
          this.searchProductsResult = response.products;
          this.router.navigate(['/products/search'], {
            queryParams: { q: this.keyword },
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getProductsByCondition(
    selectedCategoryId: number,
    selectedSubCategoryId: number
  ) {
    debugger;
    this.productService
      .getProductsByCondition(
        0,
        10000000,
        '',
        selectedCategoryId,
        selectedSubCategoryId,
        'id',
        'ascending',
        0,
        8
      )
      .subscribe({
        next: (response: ProductListResponse) => {
          debugger;
          this.products = response.products;
          this.router.navigate(['/products/all'], {
            queryParams: {
              c: selectedCategoryId,
              sc: selectedSubCategoryId,
            },
          });
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
}
