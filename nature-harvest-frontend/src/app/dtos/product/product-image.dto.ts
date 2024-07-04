export class ProductImageDto {
  urls: string[];

  constructor(data: any) {
    this.urls = data.urls;
  }
}
