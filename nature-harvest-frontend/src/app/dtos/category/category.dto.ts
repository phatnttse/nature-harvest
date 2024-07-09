export class CategoryDto {
  name: string;
  thumbnail: string;

  constructor(data: any) {
    this.name = data.name;
    this.thumbnail = data.thumbnail;
  }
}
