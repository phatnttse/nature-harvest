import { Component, OnInit } from '@angular/core';
import { ProductResponse } from '../../responses/product/product.response';
import { ProductService } from '../../services/product.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  keyword: string = '';
  searchProductsResult: ProductResponse[] = [];
  private searchTerms = new Subject<string>();

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          if (term.trim() === '') {
            this.searchProductsResult = [];
            return of({ products: [] });
          } else {
            return this.productService
              .getProducts(term, 0, 0, '', '', 0, 5)
              .pipe(
                catchError((err) => {
                  console.error(err);
                  return of({ products: [] });
                })
              );
          }
        })
      )
      .subscribe({
        next: (response) => {
          this.searchProductsResult = response.products;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.keyword = target.value;
    this.searchTerms.next(this.keyword);
  }

  search(): void {
    if (this.keyword.trim() === '') {
      this.searchProductsResult = [];
      return;
    }
    this.productService
      .getProducts(this.keyword, 0, 0, '', '', 0, 100)
      .subscribe({
        next: (response) => {
          this.searchProductsResult = response.products;
          this.router.navigate(['/products/search'], {
            queryParams: { q: this.keyword },
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  viewProduct(slug: string) {
    this.router.navigate([`/product-detail/${slug}`]);
  }
}
