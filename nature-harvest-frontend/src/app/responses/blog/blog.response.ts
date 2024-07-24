export class BlogResponse {
  id: number;
  title: string;
  content: string;
  author: string;
  thumbnail: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string;
  summary: string;
  formattedCreatedAt: string;
  formattedUpdatedAt: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.author = data.author;
    this.thumbnail = data.thumbnail;
    this.slug = data.slug;
    this.tags = data.tags;
    this.summary = data.summary;
    this.createdAt = this.convertToDate(data.createdAt);
    this.updatedAt = this.convertToDate(data.updatedAt);
    this.formattedCreatedAt = this.formatDate(this.createdAt);
    this.formattedUpdatedAt = this.formatDate(this.updatedAt);
  }
  private convertToDate(dateArray: number[]): Date {
    if (!Array.isArray(dateArray) || dateArray.length < 6) {
      throw new Error('Invalid date array');
    }
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
