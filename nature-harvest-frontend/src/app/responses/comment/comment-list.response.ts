import { CommentResponse } from './comment.response';

export class CommentListResponse {
  comments: CommentResponse[];
  totalPages: number;

  constructor(data: any) {
    this.comments = data.comments;
    this.totalPages = data.totalPages;
  }
}
