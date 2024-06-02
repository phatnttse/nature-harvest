import { Component, OnInit } from '@angular/core';
import { SearchProductsComponent } from '../search-products/search-products.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { SubCategoryService } from '../../services/subcategory.service';
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
  subcategoriesMen: SubCategoryResponse[] = [];
  subcategoriesWomen: SubCategoryResponse[] = [];
  subcategoriesKid: SubCategoryResponse[] = [];

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private subCategoryService: SubCategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.userResponse$.subscribe((userResponse) => {
      this.userResponse = userResponse;
    });
    this.getSubcategoriesOfKids();
    this.getSubcategoriesOfMen();
    this.getSubcategoriesOfWomen();
  }

  getSubcategoriesOfMen() {
    this.subCategoryService.getSubCategoriesByCategory(1).subscribe({
      next: (response: SubCategoryResponse[]) => {
        this.subcategoriesMen = response;
      },
    });
  }
  getSubcategoriesOfWomen() {
    this.subCategoryService.getSubCategoriesByCategory(2).subscribe({
      next: (response: SubCategoryResponse[]) => {
        this.subcategoriesWomen = response;
      },
    });
  }
  getSubcategoriesOfKids() {
    this.subCategoryService.getSubCategoriesByCategory(3).subscribe({
      next: (response: SubCategoryResponse[]) => {
        this.subcategoriesKid = response;
      },
    });
  }

  logOut() {
    debugger;
    this.userService.clearUserResponse();
    this.tokenService.removeToken();
  }
}
