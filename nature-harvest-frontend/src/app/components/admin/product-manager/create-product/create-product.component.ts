import { Component } from '@angular/core';
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
import { CategoryService } from '../../../../services/category.service';
import { Observable } from 'rxjs';
import { CategoryWithSubcategoriesResponse } from '../../../../responses/category/category-subcategory-response';
import { CommonModule } from '@angular/common';
import { CLOUDINARY } from '../../../../environments/environment.development';
import { CreateProductDto } from '../../../../dtos/product/create.dto';
import { ProductResponse } from '../../../../responses/product/product.response';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-product',
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
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent {
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

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService
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

  setCurrentCategory(category: CategoryWithSubcategoriesResponse): void {
    this.currentCategory = category;
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

  processResults = (error: any, result: any): void => {
    if (result.event === 'close') {
      this.isDisabled = false;
    }
    if (result && result.event === 'success') {
      const secureUrl = result.info.secure_url;
      const previewUrl = secureUrl.replace('/upload/', '/upload/w_600/');
      this.uploadedImages.push(previewUrl);
    }
    if (error) {
      this.isDisabled = false;
    }
  };

  onSubmit() {
    debugger;
    if (
      this.productForm.invalid ||
      this.selectedCategoryId <= 0 ||
      this.selectedSubCategoryId <= 0 ||
      this.uploadedImages.length <= 0
    ) {
      this.productForm.markAllAsTouched();
      this.isCategoryError = true;
      this.isPictureError = true;
      return;
    }
    const createProductDto: CreateProductDto = {
      ...this.productForm.value,
      images: this.uploadedImages,
      categoryId: this.selectedCategoryId,
      subcategoryId: this.selectedSubCategoryId,
    };
    this.productService.createProduct(createProductDto).subscribe({
      next: (response: ProductResponse) => {
        debugger;
        this.router.navigate(['/admin/products']);
        this.toastr.success('Tạo sản phẩm mới thành công');
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Tạo sản phẩm mới thất bại');
      },
    });
  }

  uploadWidget = (): void => {
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
