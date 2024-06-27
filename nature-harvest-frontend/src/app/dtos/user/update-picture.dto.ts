export class UpdatePictureDto {
  pictureUrl: string;

  constructor(data: any) {
    this.pictureUrl = data.pictureUrl;
  }
}
