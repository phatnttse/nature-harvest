import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductManagerComponent } from './product-manager/product-manager.component';
import { EditProductComponent } from './product-manager/edit-product/edit-product.component';
import { CreateProductComponent } from './product-manager/create-product/create-product.component';

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
    ],
  },
];
