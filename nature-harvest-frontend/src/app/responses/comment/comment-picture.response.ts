export class CommentPicture {
  id: number;
  pictureUrl: string;

  constructor(data: any) {
    this.id = data.id;
    this.pictureUrl = data.pictureUrl;
  }
}
