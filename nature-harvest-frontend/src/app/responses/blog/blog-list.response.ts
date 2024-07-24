import { BlogResponse } from './blog.response';

export class BlogListResponse {
  blogs: BlogResponse[];
  totalPages: number;

  constructor(data: any) {
    this.blogs = data.blogs;
    this.totalPages = data.totalPages;
  }
}
