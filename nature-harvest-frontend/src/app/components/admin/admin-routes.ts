import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'products',
        loadComponent() {
          return import('./product-manager/product-manager.component').then(
            (m) => m.ProductManagerComponent
          );
        },
      },
      {
        path: 'products/new',
        loadComponent() {
          return import(
            './product-manager/create-product/create-product.component'
          ).then((m) => m.CreateProductComponent);
        },
      },
      {
        path: 'products/:slug',
        loadComponent() {
          return import(
            './product-manager/edit-product/edit-product.component'
          ).then((m) => m.EditProductComponent);
        },
      },
      {
        path: 'categories',
        loadComponent() {
          return import('./category-manager/category-manager.component').then(
            (m) => m.CategoryManagerComponent
          );
        },
      },
      {
        path: 'categories/new',
        loadComponent() {
          return import(
            './category-manager/create-category/create-category.component'
          ).then((m) => m.CreateCategoryComponent);
        },
      },
      {
        path: 'categories/:slug',
        loadComponent() {
          return import(
            './category-manager/edit-category/edit-category.component'
          ).then((m) => m.EditCategoryComponent);
        },
      },
      {
        path: 'orders',
        loadComponent() {
          return import('./order-manager/order-manager.component').then(
            (m) => m.OrderManagerComponent
          );
        },
      },
      {
        path: 'orders/:id',
        loadComponent() {
          return import('./order-manager/edit-order/edit-order.component').then(
            (m) => m.EditOrderComponent
          );
        },
      },
      {
        path: 'coupons',
        loadComponent() {
          return import('./coupon-manager/coupon-manager.component').then(
            (m) => m.CouponManagerComponent
          );
        },
      },
      {
        path: 'coupons/new',
        loadComponent() {
          return import(
            './coupon-manager/create-coupon/create-coupon.component'
          ).then((m) => m.CreateCouponComponent);
        },
      },
      {
        path: 'coupons/:id',
        loadComponent() {
          return import(
            './coupon-manager/edit-coupon/edit-coupon.component'
          ).then((m) => m.EditCouponComponent);
        },
      },
      {
        path: 'users',
        loadComponent() {
          return import('./user-manager/user-manager.component').then(
            (m) => m.UserManagerComponent
          );
        },
      },
      {
        path: 'blogs',
        loadComponent() {
          return import('./blog-manager/blog-manager.component').then(
            (m) => m.BlogManagerComponent
          );
        },
      },
      {
        path: 'blogs/new',
        loadComponent() {
          return import(
            './blog-manager/create-blog/create-blog.component'
          ).then((m) => m.CreateBlogComponent);
        },
      },
      {
        path: 'blogs/:slug',
        loadComponent() {
          return import('./blog-manager/edit-blog/edit-blog.component').then(
            (m) => m.EditBlogComponent
          );
        },
      },
    ],
  },
];
