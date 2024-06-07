import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartResponse } from '../../responses/cart/cart.response';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { CartListResponse } from '../../responses/cart/cart-list.response';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { CartDto } from '../../dtos/cart/cart.dto';
import { RemoveCartDto } from '../../dtos/cart/remove-cart-item.dto';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-view-cart',
  standalone: true,
  templateUrl: './view-cart.component.html',
  styleUrl: './view-cart.component.scss',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    BreadcrumbComponent,
    RouterModule,
  ],
})
export class ViewCartComponent implements OnInit {
  cart: CartResponse[] = [];
  quantity: number = 1;
  cartSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private cartService: CartService,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(
      (cartData: CartListResponse) => {
        this.cart = cartData.cart;
      }
    );

    // Gọi hàm getCart() để lấy dữ liệu giỏ hàng ban đầu
    this.getCart();
  }

  getCart() {
    this.cartService.getCart().subscribe({
      next: (response: CartListResponse) => {
        this.cart = response.cart;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getTotalPrice(): number {
    return this.cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  incrementQuantity(productId: number, quantity: number) {
    const user = this.userService.getUserResponseFromLocalStorage();
    const cartDto: CartDto = {
      userId: user?.id ?? '',
      productId: productId,
      quantity: quantity + 1,
    };
    this.cartService.updateQuantity(cartDto).subscribe({
      next: (response: CartListResponse) => {
        this.cartService.updateCartState(response);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  decrementQuantity(productId: number, quantity: number) {
    const user = this.userService.getUserResponseFromLocalStorage();
    const cartDto: CartDto = {
      userId: user?.id ?? '',
      productId: productId,
      quantity: quantity - 1,
    };
    this.cartService.updateQuantity(cartDto).subscribe({
      next: (response: CartListResponse) => {
        this.cartService.updateCartState(response);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  removeProductFromCart(productId: number) {
    const user = this.userService.getUserResponseFromLocalStorage();
    const removeCartDto: RemoveCartDto = {
      userId: user?.id ?? '',
      productId: productId,
    };
    this.cartService.removeProductFromCart(removeCartDto).subscribe({
      next: (response: CartListResponse) => {
        this.cartService.updateCartState(response);
      },
      error(err: any) {
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
