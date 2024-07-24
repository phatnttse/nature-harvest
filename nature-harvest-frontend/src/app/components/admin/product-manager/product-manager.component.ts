import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductService } from '../../../services/product.service';
import { ProductResponse } from '../../../responses/product/product.response';
import { ProductDetailResponse } from '../../../responses/product/product-detail.response';
import { ProductListResponse } from '../../../responses/product/product-list.response';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeatherModule } from 'angular-feather';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { ToastrService } from 'ngx-toastr';
import { MatTabsModule } from '@angular/material/tabs';
import { CategoryWithSubcategoriesResponse } from '../../../responses/category/category-subcategory-response';
import { CategoryService } from '../../../services/category.service';
import { first, Observable } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-manager',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatPaginatorModule,
    MatFormFieldModule,
    FeatherModule,
    MatSortModule,
    MatInputModule,
    MatTabsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-manager.component.html',
  styleUrl: './product-manager.component.scss',
})
export class ProductManagerComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  products: ProductResponse[] = [];
  selectedCategoryId: number = 1;
  selectedSubCategoryId: number = 0;
  categorySlug: string = '';
  subcategorySlug: string = '';
  currentPage: number = 0;
  itemsPerPage: number = 8;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  localStorage?: Storage;
  minPrice: number = 0;
  maxPrice: number = 10000000;
  product?: ProductDetailResponse | null = null;
  modalStyle: boolean = false;
  currentImage?: string = this.product?.thumbnail;
  quantity: number = 1;
  sortBy: string = 'createdAt';
  arrange: string = 'descending';
  typeArrange: string = 'Mặc định';
  isFiltering: boolean = false;
  categoriesWithSubcategories$: Observable<CategoryWithSubcategoriesResponse[]>;
  dataSource: MatTableDataSource<ProductResponse> =
    new MatTableDataSource<ProductResponse>();
  displayedColumns: string[] = [
    'thumbnail',
    'title',
    'category',
    'originalPrice',
    'quantity',
    'discount',
    'action',
  ];
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.categoriesWithSubcategories$ =
      this.categoryService.categoriesWithSubcategories$;
  }

  ngOnInit(): void {
    this.getProductsByCondition(
      this.minPrice,
      this.maxPrice,
      this.keyword,
      this.selectedCategoryId,
      this.selectedSubCategoryId,
      this.categorySlug,
      this.subcategorySlug,
      this.sortBy,
      this.arrange,
      this.currentPage,
      this.itemsPerPage
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getProductsByCondition(
    minPrice: number,
    maxPrice: number,
    keyword: string,
    selectedCategoryId: number,
    selectedSubCategoryId: number,
    categorySlug: string,
    subcategorySlug: string,
    sortBy: string,
    arrange: string,
    page: number,
    limit: number
  ) {
    debugger;
    this.selectedCategoryId = selectedCategoryId;
    this.selectedSubCategoryId = selectedSubCategoryId;
    this.sortBy = sortBy;
    this.arrange = arrange;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.productService
      .getProductsByCondition(
        minPrice,
        maxPrice,
        keyword,
        selectedCategoryId,
        selectedSubCategoryId,
        categorySlug,
        subcategorySlug,
        sortBy,
        arrange,
        page,
        limit
      )
      .subscribe({
        next: (response: ProductListResponse) => {
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(
            this.currentPage,
            this.totalPages
          );
          this.dataSource = new MatTableDataSource(response.products);
          this.dataSource.sort = this.sort;
        },
        error: (error: any) => {
          console.error('Error fetching products:', error);
        },
      });
  }

  openDialog(productId: number) {
    const dialogRef = this.dialog.open(DeleteProductComponent, {
      width: '400px',
      data: { productId },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getProductsByCondition(
          this.minPrice,
          this.maxPrice,
          this.keyword,
          this.selectedCategoryId,
          this.selectedSubCategoryId,
          this.categorySlug,
          this.subcategorySlug,
          this.sortBy,
          this.arrange,
          this.currentPage,
          this.itemsPerPage
        );
        this.toastr.success('Xoá sản phẩm thành công');
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentProductPage', String(this.currentPage));

    this.getProductsByCondition(
      this.minPrice,
      this.maxPrice,
      this.keyword,
      this.selectedCategoryId,
      this.selectedSubCategoryId,
      this.categorySlug,
      this.subcategorySlug,
      this.sortBy,
      this.arrange,
      this.currentPage,
      this.itemsPerPage
    );
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onTabChange(event: any) {
    const selectedIndex = event.index;

    this.categoriesWithSubcategories$.pipe(first()).subscribe((categories) => {
      const selectedCategory = categories[selectedIndex];
      this.selectedCategoryId = selectedCategory.id;
      this.categorySlug = selectedCategory.slug;

      this.getProductsByCondition(
        this.minPrice,
        this.maxPrice,
        this.keyword,
        this.selectedCategoryId,
        this.selectedSubCategoryId,
        this.categorySlug,
        this.subcategorySlug,
        this.sortBy,
        this.arrange,
        this.currentPage,
        this.itemsPerPage
      );
    });
  }
}
