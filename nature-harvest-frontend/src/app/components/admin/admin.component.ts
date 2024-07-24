import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Observable, Subscription, map, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { UserResponse } from '../../responses/user/user.response';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { MatInputModule } from '@angular/material/input';
import { CategoryWithSubcategoriesResponse } from '../../responses/category/category-subcategory-response';
import { CategoryService } from '../../services/category.service';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss', './../../../assets/styles/style.scss'],
  encapsulation: ViewEncapsulation.None,

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatBadgeModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatToolbarModule,
    FeatherModule,
  ],
})
export class AdminComponent implements OnInit, OnDestroy {
  search: boolean = false;
  subscriptions: Subscription[] = [];
  userResponse?: UserResponse | null;
  categoriesWithSubcategories$: Observable<CategoryWithSubcategoriesResponse[]>;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.categoriesWithSubcategories$ =
      this.categoryService.categoriesWithSubcategories$;
  }

  ngOnInit(): void {
    const userSubscription = this.userService.userResponse$.subscribe(
      (userResponse) => {
        this.userResponse = userResponse;
      }
    );
    this.subscriptions.push(userSubscription);

    this.categoryService.categoriesWithSubcategories$;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  logOut() {
    this.userService.clearUserResponse();
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  routerActive: string = 'activelink';
  sidebarMenu: sidebarMenu[] = [
    {
      link: '/admin',
      icon: 'home',
      menu: 'Dashboard',
    },
    {
      link: '/admin/products',
      icon: 'package',
      menu: 'Products',
    },
    {
      link: '/admin/categories',
      icon: 'layout',
      menu: 'Categories',
    },
    {
      link: '/admin/orders',
      icon: 'shopping-bag',
      menu: 'Orders',
    },
    {
      link: '/admin/coupons',
      icon: 'zap',
      menu: 'Coupons',
    },
    {
      link: '/admin/users',
      icon: 'users',
      menu: 'Users',
    },
    {
      link: '/admin/blogs',
      icon: 'film',
      menu: 'Blogs',
    },
  ];
}
