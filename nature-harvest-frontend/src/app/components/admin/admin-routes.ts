import { Routes } from '@angular/router';
import { AdminGuard } from '../../guards/admin.guard';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    loadComponent() {
      return import('./admin.component').then((m) => m.AdminComponent);
    },
    canActivate: [AdminGuard],
    children: [
      {
        path: 'products',
        loadComponent() {
          return import('./product-manager/product-manager.component').then(
            (m) => m.ProductManagerComponent
          );
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'products/new',
        loadComponent() {
          return import(
            './product-manager/create-product/create-product.component'
          ).then((m) => m.CreateProductComponent);
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'products/:slug',
        loadComponent() {
          return import(
            './product-manager/edit-product/edit-product.component'
          ).then((m) => m.EditProductComponent);
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'categories',
        loadComponent() {
          return import('./category-manager/category-manager.component').then(
            (m) => m.CategoryManagerComponent
          );
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'categories/new',
        loadComponent() {
          return import(
            './category-manager/create-category/create-category.component'
          ).then((m) => m.CreateCategoryComponent);
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'categories/:slug',
        loadComponent() {
          return import(
            './category-manager/edit-category/edit-category.component'
          ).then((m) => m.EditCategoryComponent);
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'orders',
        loadComponent() {
          return import('./order-manager/order-manager.component').then(
            (m) => m.OrderManagerComponent
          );
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'orders/:id',
        loadComponent() {
          return import('./order-manager/edit-order/edit-order.component').then(
            (m) => m.EditOrderComponent
          );
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'coupons',
        loadComponent() {
          return import('./coupon-manager/coupon-manager.component').then(
            (m) => m.CouponManagerComponent
          );
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'coupons/new',
        loadComponent() {
          return import(
            './coupon-manager/create-coupon/create-coupon.component'
          ).then((m) => m.CreateCouponComponent);
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'coupons/:id',
        loadComponent() {
          return import(
            './coupon-manager/edit-coupon/edit-coupon.component'
          ).then((m) => m.EditCouponComponent);
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'users',
        loadComponent() {
          return import('./user-manager/user-manager.component').then(
            (m) => m.UserManagerComponent
          );
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'blogs',
        loadComponent() {
          return import('./blog-manager/blog-manager.component').then(
            (m) => m.BlogManagerComponent
          );
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'blogs/new',
        loadComponent() {
          return import(
            './blog-manager/create-blog/create-blog.component'
          ).then((m) => m.CreateBlogComponent);
        },
        canActivate: [AdminGuard],
      },
      {
        path: 'blogs/:slug',
        loadComponent() {
          return import('./blog-manager/edit-blog/edit-blog.component').then(
            (m) => m.EditBlogComponent
          );
        },
        canActivate: [AdminGuard],
      },
    ],
  },
];
