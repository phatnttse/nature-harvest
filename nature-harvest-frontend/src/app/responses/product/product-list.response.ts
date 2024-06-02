import { ProductResponse } from './product.response';

export class ProductListResponse {
  products: ProductResponse[];
  totalPages: number;

  constructor(data: any) {
    this.products = data.productResponse;
    this.totalPages = data.totalPages;
  }
}
