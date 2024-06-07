import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { CartResponse } from '../../responses/cart/cart.response';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { CartListResponse } from '../../responses/cart/cart-list.response';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  Validators,
} from '@angular/forms';
import { UserResponse } from '../../responses/user/user.response';
import { OrderDto } from '../../dtos/order/order.dto';
import { OrderResponse } from '../../responses/order/order.response';
import { CartDto } from '../../dtos/cart/cart.dto';

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterModule,
    CommonModule,
    FormsModule,
  ],
})
export class OrderComponent implements OnInit {
  private userService = inject(UserService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  cart: CartResponse[] = [];
  userResponse?: UserResponse | null;
  orderForm: FormGroup;
  orderData: OrderDto = {
    userId: '',
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    note: '',
    paymentMethod: '',
    amount: 0,
    cartItems: [],
  };

  constructor() {
    this.orderForm = this.formBuilder.group({
      userId: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(6)]],
      deliveryAddress: ['', [Validators.required, Validators.minLength(5)]],
      note: [''],
      paymentMethod: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.userResponse$.subscribe((userResponse) => {
      this.userResponse = userResponse;
    });
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

  order() {
    debugger;
    if (this.orderForm.errors == null) {
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value,
      };
      this.orderData.cartItems = this.cart.map((cartItem) => ({
        userId: cartItem.userId,
        productId: cartItem.product.id,
        quantity: cartItem.quantity,
      }));
      this.orderData.amount = this.getTotalPrice();
      this.orderService.order(this.orderData).subscribe({
        next: (response: OrderResponse) => {
          debugger;
          const cartDto: any = {
            userId: this.userResponse?.id || null,
          };
          this.cartService.clearCart(cartDto);
          this.router.navigate(['/']);
        },
      });
    }
  }
}
