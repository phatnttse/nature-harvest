import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { EditProductComponent } from './product-manager/edit-product/edit-product.component';
import { CreateProductComponent } from './product-manager/create-product/create-product.component';
import { CategoryManagerComponent } from './category-manager/category-manager.component';
import { CreateCategoryComponent } from './category-manager/create-category/create-category.component';
import { EditCategoryComponent } from './category-manager/edit-category/edit-category.component';
import { OrderManagerComponent } from './order-manager/order-manager.component';
import { EditOrderComponent } from './order-manager/edit-order/edit-order.component';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'products',
        component: ProductManagerComponent,
      },
      {
        path: 'products/new',
        component: CreateProductComponent,
      },
      {
        path: 'products/:slug',
        component: EditProductComponent,
      },
      {
        path: 'categories',
        component: CategoryManagerComponent,
      },
      {
        path: 'categories/new',
        component: CreateCategoryComponent,
      },
      {
        path: 'categories/:slug',
        component: EditCategoryComponent,
      },
      {
        path: 'orders',
        component: OrderManagerComponent,
      },
      {
        path: 'orders/:id',
        component: EditOrderComponent,
      },
    ],
  },
];
