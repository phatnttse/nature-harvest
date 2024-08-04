import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { adminRoutes } from './components/admin/admin-routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent() {
      return import('./components/home/home.component').then(
        (m) => m.HomeComponent
      );
    },
  },
  {
    path: 'login',
    loadComponent() {
      return import('./components/login/login.component').then(
        (m) => m.LoginComponent
      );
    },
  },
  {
    path: 'signup',
    loadComponent() {
      return import('./components/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent
      );
    },
  },
  {
    path: 'profile',
    loadComponent() {
      return import('./components/profile/profile.component').then(
        (m) => m.ProfileComponent
      );
    },
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Hồ sơ' },
  },
  {
    path: 'products/listc/:category-slug',
    loadComponent() {
      return import('./components/product/product.component').then(
        (m) => m.ProductComponent
      );
    },
    data: { breadcrumb: 'Danh sách sản phẩm' },
  },
  {
    path: 'products/listsc/:subcategory-slug',
    loadComponent() {
      return import('./components/product/product.component').then(
        (m) => m.ProductComponent
      );
    },
    data: { breadcrumb: 'Danh sách sản phẩm' },
  },
  {
    path: 'products/list/all',
    loadComponent() {
      return import('./components/product/product.component').then(
        (m) => m.ProductComponent
      );
    },
    data: { breadcrumb: 'Danh sách sản phẩm' },
  },
  {
    path: 'verify-email',
    loadComponent() {
      return import('./components/verify-email/verify-email.component').then(
        (m) => m.VerifyEmailComponent
      );
    },
  },
  {
    path: 'verify-email/:token/:email',
    loadComponent() {
      return import('./components/verify-email/verify-email.component').then(
        (m) => m.VerifyEmailComponent
      );
    },
  },
  {
    path: 'product-detail/:slug',
    loadComponent() {
      return import(
        './components/product-detail/product-detail.component'
      ).then((m) => m.ProductDetailComponent);
    },
    data: { breadcrumb: 'Chi tiết sản phẩm' },
  },
  {
    path: 'view-cart',
    loadComponent() {
      return import('./components/view-cart/view-cart.component').then(
        (m) => m.ViewCartComponent
      );
    },
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Giỏ hàng' },
  },
  {
    path: 'order',
    loadComponent() {
      return import('./components/order/order.component').then(
        (m) => m.OrderComponent
      );
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'vnpay-pay',
    loadComponent() {
      return import('./components/vn-pay-pay/vn-pay-pay.component').then(
        (m) => m.VnPayPayComponent
      );
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'momo-pay',
    loadComponent() {
      return import('./components/momo-pay/momo-pay.component').then(
        (m) => m.MomoPayComponent
      );
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'order-success',
    loadComponent() {
      return import('./components/order-success/order-success.component').then(
        (m) => m.OrderSuccessComponent
      );
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'order-success/:id',
    loadComponent() {
      return import('./components/order-success/order-success.component').then(
        (m) => m.OrderSuccessComponent
      );
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'products/search',
    loadComponent() {
      return import(
        './components/search-products/search-products.component'
      ).then((m) => m.SearchProductsComponent);
    },
  },
  {
    path: 'order-tracking',
    loadComponent() {
      return import(
        './components/order-tracking/order-tracking.component'
      ).then((m) => m.OrderTrackingComponent);
    },
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Theo dõi đơn hàng' },
  },
  {
    path: 'blogs',
    loadComponent() {
      return import('./components/blog/blog.component').then(
        (m) => m.BlogComponent
      );
    },
    data: { breadcrumb: 'Tin tức' },
  },
  {
    path: 'blogs/:slug',
    loadComponent() {
      return import('./components/blog-detail/blog-detail.component').then(
        (m) => m.BlogDetailComponent
      );
    },
  },
  {
    path: 'contact',
    loadComponent() {
      return import('./components/contact/contact.component').then(
        (m) => m.ContactComponent
      );
    },
    data: { breadcrumb: 'Liên hệ' },
  },
  {
    path: 'forgot-password',
    loadComponent() {
      return import(
        './components/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordComponent);
    },
  },

  //admin
  ...adminRoutes,
  {
    path: 'pages/404',
    loadComponent() {
      return import('./pages/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      );
    },
  },
  { path: '**', redirectTo: 'pages/404' },
];
