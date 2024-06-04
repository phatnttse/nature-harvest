import { Component, OnInit } from '@angular/core';
import { SearchProductsComponent } from '../search-products/search-products.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { SubCategoryResponse } from '../../responses/subcategory/subcategory.response';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [SearchProductsComponent, ShoppingCartComponent, RouterModule],
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.userResponse$.subscribe((userResponse) => {
      this.userResponse = userResponse;
    });
  }

  logOut() {
    debugger;
    this.userService.clearUserResponse();
    this.tokenService.removeToken();
  }
}
