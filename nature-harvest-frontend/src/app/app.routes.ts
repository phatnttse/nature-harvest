import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductComponent } from './components/product/product.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ViewCartComponent } from './components/view-cart/view-cart.component';
import { OrderComponent } from './components/order/order.component';
import { VnPayPayComponent } from './components/vn-pay-pay/vn-pay-pay.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { MomoPayComponent } from './components/momo-pay/momo-pay.component';
import { SearchProductsComponent } from './components/search-products/search-products.component';
import { OrderTrackingComponent } from './components/order-tracking/order-tracking.component';
import { AdminComponent } from './components/admin/admin.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'products/listc/:category-slug', component: ProductComponent },
  { path: 'products/listsc/:subcategory-slug', component: ProductComponent },
  { path: 'products/list/all', component: ProductComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'product-detail/:slug', component: ProductDetailComponent },
  { path: 'view-cart', component: ViewCartComponent },
  { path: 'order', component: OrderComponent },
  { path: 'vnpay-pay', component: VnPayPayComponent },
  { path: 'momo-pay', component: MomoPayComponent },
  { path: 'order-success', component: OrderSuccessComponent },
  { path: 'order-success/:id', component: OrderSuccessComponent },
  { path: 'products/search', component: SearchProductsComponent },
  { path: 'order-tracking', component: OrderTrackingComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent},
  //admin
  { path: 'admin', component: AdminComponent },
];
