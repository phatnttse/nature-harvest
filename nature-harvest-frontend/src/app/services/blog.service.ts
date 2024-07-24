import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtilService } from './http.util.service';
import { environment } from '../environments/environment.development';
import { BlogListResponse } from '../responses/blog/blog-list.response';
import { BlogDto } from '../dtos/blog/blog.dto';
import { BlogResponse } from '../responses/blog/blog.response';
import { BaseResponse } from '../responses/base/base.response';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiBaseUrl = environment.apiBaseUrl;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  };

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService
  ) {}

  createBlog(blogDto: BlogDto): Observable<BlogResponse> {
    return this.http.post<BlogResponse>(
      `${this.apiBaseUrl}/blogs`,
      blogDto,
      this.apiConfig
    );
  }

  updateBlog(blogDto: BlogDto, blogId: number): Observable<BlogResponse> {
    return this.http.patch<BlogResponse>(
      `${this.apiBaseUrl}/blogs/${blogId}`,
      blogDto,
      this.apiConfig
    );
  }

  deleteBlog(blogId: number): Observable<BaseResponse> {
    return this.http.delete<BaseResponse>(
      `${this.apiBaseUrl}/blogs/${blogId}`,
      this.apiConfig
    );
  }

  getBlogs(page: number, limit: number): Observable<BlogListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<BlogListResponse>(`${this.apiBaseUrl}/blogs`, {
      ...this.apiConfig,
      params,
    });
  }

  getBlog(blogId: number): Observable<BlogResponse> {
    return this.http.get<BlogResponse>(
      `${this.apiBaseUrl}/blogs/${blogId}`,
      this.apiConfig
    );
  }

  getBlogsByTag(tag: string): Observable<BlogListResponse> {
    return this.http.get<BlogListResponse>(
      `${this.apiBaseUrl}/blogs/tags/${tag}`,
      this.apiConfig
    );
  }
  getBlogBySlug(slug: string): Observable<BlogResponse> {
    return this.http.get<BlogResponse>(
      `${this.apiBaseUrl}/blogs/slug/${slug}`,
      this.apiConfig
    );
  }
}
