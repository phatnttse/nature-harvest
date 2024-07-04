import { CommentResponse } from './comment.response';

export class CommentListResponse {
  comments: CommentResponse[];
  totalPages: number;
  totalReviews: number;
  fiveStarReviews: number;
  fourStarReviews: number;
  threeStarReviews: number;
  twoStarReviews: number;
  oneStarReviews: number;
  imageReviews: number;

  constructor(data: any) {
    this.comments = data.comments;
    this.totalPages = data.totalPages;
    this.totalReviews = data.totalReviews;
    this.fiveStarReviews = data.fiveStarReviews;
    this.fourStarReviews = data.fourStarReviews;
    this.threeStarReviews = data.threeStarReviews;
    this.twoStarReviews = data.twoStarReviews;
    this.oneStarReviews = data.oneStarReviews;
    this.imageReviews = data.imageReviews;
  }
}
