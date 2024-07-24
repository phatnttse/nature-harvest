export class BlogDto {
  title: string;
  content: string;
  thumbnail: string;
  tags: string;
  summary: string;

  constructor(data: any) {
    this.title = data.title;
    this.content = data.content;
    this.thumbnail = data.thumbnail;
    this.tags = data.tags;
    this.summary = data.summary;
  }
}
