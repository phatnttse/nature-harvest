import { BlogComponent } from './../blog/blog.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogResponse } from '../../responses/blog/blog.response';
import { HttpErrorResponse } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { HeaderComponent } from '../header/header.component';
import { BlogListResponse } from '../../responses/blog/blog-list.response';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    FooterComponent,
    BreadcrumbComponent,
    HeaderComponent,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./../blog/blog.component.scss'],
})
export class BlogDetailComponent implements OnInit {
  blog: BlogResponse | null = null;
  blogs: BlogResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 8;
  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService
  ) {}
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      debugger;
      if (slug) {
        this.getBlog(slug);
        this.getBlogs();
      } else {
        console.error('Invalid slug:', slug);
      }
    });
  }
  getBlog(slug: string) {
    this.blogService.getBlogBySlug(slug).subscribe({
      next: (response: BlogResponse) => {
        debugger;
        this.blog = new BlogResponse(response);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
  getBlogs() {
    this.blogService.getBlogs(this.currentPage, this.itemsPerPage).subscribe({
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
}
