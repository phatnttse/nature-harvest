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
import { PaymentComponent } from './components/payment/payment.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'product-all', component: ProductComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'view-cart', component: ViewCartComponent },
  { path: 'order', component: OrderComponent },
  { path: 'payment', component: PaymentComponent },
];
