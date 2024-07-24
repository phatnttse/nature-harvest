import { BlogService } from './../../../services/blog.service';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DeleteBlogComponent } from './delete-blog/delete-blog.component';
import { BlogResponse } from '../../../responses/blog/blog.response';
import { BlogListResponse } from '../../../responses/blog/blog-list.response';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-blog-manager',
  standalone: true,
  imports: [
    MatCardModule,
    MatTableModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatSortModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './blog-manager.component.html',
  styleUrl: './blog-manager.component.scss',
})
export class BlogManagerComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<BlogResponse>();
  displayedColumns: string[] = [
    'thumbnail',
    'title',
    'author',
    'tags',
    'action',
  ];
  currentPage: number = 0;
  itemsPerPage: number = 8;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  localStorage?: Storage;
  blogs: BlogResponse[] = [];

  constructor(
    private blogService: BlogService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getBlogs(this.currentPage, this.itemsPerPage);
  }

  getBlogs(page: number, limit: number) {
    this.blogService.getBlogs(page, limit).subscribe({
      next: (response: BlogListResponse) => {
        this.blogs = response.blogs;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(
          this.currentPage,
          this.totalPages
        );
        this.dataSource = new MatTableDataSource(response.blogs);
        this.dataSource.sort = this.sort;
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  openDialog(blogId: number) {
    debugger;
    const dialogRef = this.dialog.open(DeleteBlogComponent, {
      width: '400px',
      data: blogId,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      debugger;
      if (result) {
        this.getBlogs(this.currentPage, this.itemsPerPage);
        this.toastr.success('Xoá blog thành công');
      }
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
