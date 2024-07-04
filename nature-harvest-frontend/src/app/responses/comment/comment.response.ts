import { UserResponse } from '../user/user.response';
import { CommentPicture } from './comment-picture.response';

export class CommentResponse {
  id: number;
  content: string;
  userResponse: UserResponse;
  pictures: CommentPicture[];
  starRating: number;
  createdAt: Date;
  updatedAt: Date;
  formattedCreatedAt: string;
  formattedUpdatedAt: string;

  constructor(data: any) {
    this.id = data.id;
    this.content = data.content;
    this.userResponse = data.userResponse;
    this.pictures = data.pictures;
    this.starRating = data.starRating;
    this.createdAt = this.convertToDate(data.createdAt);
    this.updatedAt = this.convertToDate(data.updatedAt);
    this.formattedCreatedAt = this.formatDate(this.createdAt);
    this.formattedUpdatedAt = this.formatDate(this.updatedAt);
  }

  private convertToDate(dateArray: number[]): Date {
    const [year, month, day, hours, minutes, seconds] = dateArray;
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }
  public formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
  }
}
