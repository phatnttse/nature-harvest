import { Component, OnInit } from '@angular/core';
import { SearchProductsComponent } from '../search-products/search-products.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartListResponse } from '../../responses/cart/cart-list.response';
import { CartSizeResponse } from '../../responses/cart/cart-size.response';
import { Subscription } from 'rxjs';
import { CartResponse } from '../../responses/cart/cart.response';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [SearchProductsComponent, ShoppingCartComponent, RouterModule],
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  cartSize: number = 0;
  cartSubscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.userService.userResponse$.subscribe((userResponse) => {
      this.userResponse = userResponse;
    });

    this.cartSubscription = this.cartService.cart$.subscribe(
      (cartData: CartListResponse) => {
        this.cartSize = cartData.cart.length;
      }
    );
    this.getCart();
  }

  logOut() {
    debugger;
    this.userService.clearUserResponse();
    this.tokenService.removeToken();
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
}
