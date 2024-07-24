import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { BlogService } from '../../services/blog.service';
import { BlogResponse } from '../../responses/blog/blog.response';
import { BlogListResponse } from '../../responses/blog/blog-list.response';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    RouterModule,
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  blogs: BlogResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 8;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  localStorage?: Storage;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.getBlogs(this.currentPage, this.itemsPerPage);
  }

  getBlogs(page: number, limit: number) {
    this.blogService.getBlogs(page, limit).subscribe({
      next: (response: BlogListResponse) => {
        debugger;
        this.blogs = response.blogs.map(
          (blogData) => new BlogResponse(blogData)
        );
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(
          this.currentPage,
          this.totalPages
        );
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  getBlogsByTag(tag: string) {
    this.blogService.getBlogsByTag(tag).subscribe({
      next: (response: BlogListResponse) => {
        debugger;
        this.blogs = response.blogs.map(
          (blogData) => new BlogResponse(blogData)
        );
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentBlogPage', String(this.currentPage));
    this.getBlogs(this.currentPage, this.itemsPerPage);
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
}
