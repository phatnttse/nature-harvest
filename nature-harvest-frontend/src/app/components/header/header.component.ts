import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    RouterModule,
    CommonModule,
    CommonModule,
    FormsModule,
    SearchComponent,
  ],
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  cartSize: number = 0;
  cartSubscription: Subscription | null = null;
  showProductNavbar: boolean = false;
  categoriesWithSubcategories$: Observable<CategoryWithSubcategoriesResponse[]>;
  products: ProductResponse[] = [];
  subscriptions: Subscription[] = [];
  dropdownVisible = false;

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
    this.userService.userResponse$.subscribe((userResponse) => {
      this.userResponse = userResponse;
      if (this.userResponse != null) this.getCart();
    });

    this.cartSubscription = this.cartService.cart$.subscribe(
      (cartData: CartListResponse) => {
        this.cartSize = cartData.cart.length;
      }
    );
    this.categoryService.categoriesWithSubcategories$;
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
  selectCategory(categorySlug: string) {
    this.router.navigate(['/products/listc/' + categorySlug]);
  }
  selectSubcategory(subcategorySlug: string) {
    this.router.navigate(['/products/listsc/' + subcategorySlug]);
  }
  editProfile() {
    this.router.navigate(['/profile']);
  }
}
