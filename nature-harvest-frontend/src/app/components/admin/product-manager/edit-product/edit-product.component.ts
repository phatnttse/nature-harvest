import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { ProductService } from '../../../../services/product.service';
import { CategoryWithSubcategoriesResponse } from '../../../../responses/category/category-subcategory-response';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../../services/category.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductDetailResponse } from '../../../../responses/product/product-detail.response';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CLOUDINARY } from '../../../../environments/environment.development';
import { UpdateProductDto } from '../../../../dtos/product/update.dto';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  currentCategory: CategoryWithSubcategoriesResponse | null = null;
  categoriesWithSubcategories$: Observable<CategoryWithSubcategoriesResponse[]>;
  selectedCategoryId: number = 0;
  selectedSubCategoryId: number = 0;
  selectedCategoryName: string | null = null;
  selectedSubCategoryName: string | null = null;
  uploadedImage = '';
  uploadedImages: string[] = [];
  isDisabled: boolean = false;
  isCategoryError: boolean = false;
  isPictureError: boolean = false;
  product?: ProductDetailResponse | null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.categoriesWithSubcategories$ =
      this.categoryService.categoriesWithSubcategories$;

    this.productForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      price: ['', [Validators.required, Validators.min(1000)]],
      description: ['', [Validators.required, Validators.minLength(100)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      discount: ['', [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const slug = this.activatedRoute.snapshot.paramMap.get('slug');
    if (slug) {
      this.getProductDetails(slug);
    }
  }
  getProductDetails(slug: string) {
    this.productService.getDetailProductBySlug(slug).subscribe({
      next: (response: ProductDetailResponse) => {
        debugger;
        this.product = response;
        this.selectedCategoryId = response.category.id;
        this.selectedSubCategoryId = response.subCategory.id;
        this.selectedCategoryName = response.category.name;
        this.selectedSubCategoryName = response.subCategory.name;
        this.productForm.patchValue({
          ...response,
          price: response.originalPrice,
        });
      },
      complete: () => {
        debugger;
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        console.error(error?.error?.message ?? '');
      },
    });
  }
  saveChanges() {
    debugger;
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const updateProductDto: UpdateProductDto = {
      ...this.productForm.value,
      images: this.uploadedImages,
      categoryId: this.selectedCategoryId,
      subcategoryId: this.selectedSubCategoryId,
    };
    this.productService
      .updateProduct(this.product?.id!, updateProductDto)
      .subscribe({
        next: (response: ProductDetailResponse) => {
          debugger;
          this.product = response;
          this.selectedCategoryId = response.category.id;
          this.selectedSubCategoryId = response.subCategory.id;
          this.selectedCategoryName = response.category.name;
          this.selectedSubCategoryName = response.subCategory.name;
          this.productForm = this.formBuilder.group({
            title: [
              response.title,
              [Validators.required, Validators.minLength(5)],
            ],
            price: [
              response.originalPrice,
              [Validators.required, Validators.min(1000)],
            ],
            description: [
              response.description,
              [Validators.required, Validators.minLength(100)],
            ],
            quantity: [
              response.quantity,
              [Validators.required, Validators.min(1)],
            ],
            discount: [response.discount, [Validators.min(0)]],
          });
          this.toastr.success('Lưu thay đổi thành công');
        },
        error: (err) => {
          console.log(err);
          this.toastr.error('Lưu thay đổi thất bại');
        },
      });
  }
  selectCategory(
    categoryId: number,
    categoryName: string,
    subcategoryId: number,
    subcategoryName: string
  ): void {
    this.selectedCategoryId = categoryId;
    this.selectedCategoryName = categoryName;
    this.selectedSubCategoryId = subcategoryId;
    this.selectedSubCategoryName = subcategoryName;
    this.isCategoryError = false;
  }
  setCurrentCategory(category: CategoryWithSubcategoriesResponse): void {
    this.currentCategory = category;
  }
  processResults = (error: any, result: any): void => {
    if (result.event === 'close') {
      this.isDisabled = false;
    }
    if (result && result.event === 'success') {
      const secureUrl = result.info.secure_url;
      const previewUrl = secureUrl.replace('/upload/', '/upload/w_600/');
      this.uploadedImages.push(previewUrl);
      localStorage.setItem(
        'uploadedProductImages',
        JSON.stringify(this.uploadedImages)
      );
    }
    if (error) {
      this.isDisabled = false;
    }
  };

  uploadWidget = (): void => {
    if (this.product?.productImages.length! + this.uploadedImages.length >= 5) {
      this.toastr.warning('Không thể thêm quá 5 hình ảnh');
      return;
    }
    this.isDisabled = true;
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUDINARY.cloudName,
        uploadPreset: CLOUDINARY.uploadPreset,
        sources: ['local', 'url'],
        tags: ['myphotoalbum-nature-harvest'],
        clientAllowedFormats: ['image'],
        resourceType: 'image',
        maxFileSize: 2 * 1024 * 1024,
      },
      this.processResults
    );
  };
}
